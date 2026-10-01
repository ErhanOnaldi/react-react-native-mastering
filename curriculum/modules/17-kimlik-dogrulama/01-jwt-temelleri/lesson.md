---
title: "JWT: üç parçalı oturum bileti"
minutes: 14
kind: concept
---

# JWT: üç parçalı oturum bileti

Sinema'da favori film eklemek için API'ye istek attığını düşün. Sunucu, isteğin hangi kullanıcıya ait olduğunu bilmek ister. Bir düğmeye basınca React'te `isLoggedIn = true` yapmak bu soruyu cevaplamaz; bu değer yalnızca tarayıcıdaki arayüzü değiştirir. Sunucunun her istekte inceleyebileceği bir kimlik kanıtına ihtiyacımız var.

Bu kanıt çoğu API'de `access token` denen bir dizgidir. Yaygın biçimlerden biri **JWT**'dir (JSON Web Token): sunucunun imzaladığı, istekle birlikte gönderilebilen bir metin. JWT'yi kapalı bir zarf gibi değil, üzerindeki imza sayesinde değiştirilip değiştirilmediği anlaşılabilen bir kart gibi düşün. Kartın içindeki bilgiler okunabilir.

## Bir metinde üç parça

Bir JWT noktayla ayrılmış üç parçadan oluşur. Parçalara noktalardan bölerek bakalım:

```text
aaa.bbb.ccc
```

İlk örnekte yalnızca parçaların görevlerini adlandıralım:

```text
Header.Payload.Signature
```

`Header` (başlık), token'ın türü ve imza algoritması hakkında bilgi taşır. `Payload` (gövde), kullanıcı kimliği ve zaman gibi verileri taşır. `Signature` (imza), sunucunun ilk iki parçayı kendi gizli anahtarıyla imzalaması sonucu oluşur. Bu isimleri gördüğünde hangi parçaya baktığını bilmen yeterli.

İkinci örnekte payload'ın okuyabildiğin JSON olduğunu varsayalım:

```json
{
  "sub": "user_42",
  "name": "Deniz",
  "exp": 1800000000
}
```

Buradaki `sub` kullanıcı kimliğini, `name` gösterilecek adı, `exp` ise son kullanma anını anlatıyor. Sunucu payload'a ihtiyacı olan bilgileri koyar. Çünkü payload şifreli değildir; **Base64URL** adlı metin kodlamasıyla taşınabilir hale getirilmiştir. Kodlama, metnin gösterimini değiştirir; gizli hale getirmez. Bu yüzden token'a parola veya kredi kartı gibi sırlar konmaz.

Üçüncü örnekte payload'ı değiştirdiğini düşün: `name` alanını “Deniz” yerine “Yönetici” yaptın. Değişen payload artık sunucunun imzaladığı içerikle eşleşmez. Sunucu istekteki imzayı kendi anahtarıyla kontrol eder ve değişikliği fark ederek token'ı reddeder. İmzanın amacı veriyi saklamak değil, imzalanmış parçaların kurcalanıp kurcalanmadığını denetlemektir.

![JSON Web Token anatomisi: Header, Payload ve Signature](diagrams/jwt-yapisi.svg "JWT üç parçadan oluşur; Header, Payload ve Signature.")

### Okumak, doğrulamak değildir

Tarayıcıda payload'ı açıp içindeki `name` veya `exp` alanını okumaya **decode** (kodlanmış metni çözme) denir. **Verify** ise imzanın sunucunun anahtarına göre geçerli olup olmadığını kontrol etmektir. İstemci payload'ı decode edebilir, ama sunucunun gizli anahtarına sahip olmadığı için imzayı güvenilir biçimde verify edemez.

Bu farkı küçük bir karşılaştırmada görelim:

| İşlem | Kim yapabilir? | Ne öğrenir? |
| --- | --- | --- |
| Payload'ı decode etmek | Tarayıcı kodu | Payload'da yazan değerleri |
| İmzayı verify etmek | Sunucu | Token'ın imzasının geçerli olup olmadığını |

Bu nedenle istemci `name` alanını ekranda göstermek için okuyabilir; fakat `role: "admin"` yazıyor diye API'den yönetici yetkisi isteyemez. Yetki kararını sunucu verir. İstemcinin okuduğu bilgi yalnızca arayüz için bir ipucudur.

Örneğin payload'daki `exp` değerine bakıp oturum süresi yaklaşırken giriş ekranını önceden göstermek kullanıcı deneyimini iyileştirebilir. Yine de bu yalnızca istemcinin tahminidir: saat yanlış ayarlanmış olabilir veya token sunucuda geçersiz kılınmış olabilir. Sunucu her korumalı istekte kendi doğrulamasını yapar; arayüzdeki kontrol sunucunun cevabını geçersiz kılamaz.

## `exp` için saat birimi

Payload'daki `exp` alanı Unix saniyesidir: 1 Ocak 1970'ten beri geçen saniye sayısı. JavaScript'teki `Date.now()` ise milisaniye verir. İkisi de `number` olsa bile farklı ölçü birimleridir.

```text
exp         = 1_800_000_000       // saniye
Date.now()  = 1_800_000_001_000   // milisaniye
```

Bu örnekte doğru karşılaştırma için saniyeyi milisaniyeye çeviririz:

Öğrencilerin sık yaptığı hata, saniye ve milisaniyeyi doğrudan karşılaştırmaktır. Düzeltilmiş hesabı izleyelim:

```ts check
const expSeconds = 1_800_000_000
const nowMilliseconds = 1_799_999_999_000

const expired = expSeconds * 1000 <= nowMilliseconds
console.log(expired) // false
```

İlk olarak `expSeconds * 1000` sonucu `1_800_000_000_000` olur. Sonra bunu `1_799_999_999_000` ile karşılaştırırız: son kullanma anı şimdiki zamandan 1 saniye ileridedir, bu yüzden token henüz dolmamıştır. Saniyeyi doğrudan milisaniyeyle kıyaslamak sayısal olarak çalışıyor görünür ama sonucu bozabilir.

Zaman sırasını tabloyla da izleyelim:

| Adım | Değer | Birim | Yorum |
| --- | ---: | --- | --- |
| Payload'dan `exp` oku | `1_800_000_000` | saniye | Son kullanma anı |
| `exp * 1000` hesapla | `1_800_000_000_000` | milisaniye | Aynı an, farklı birim |
| `Date.now()` oku | `1_799_999_999_000` | milisaniye | Şu an, bir saniye öncesi |
| Karşılaştır | `exp * 1000 <= Date.now()` | — | `false`, token henüz dolmadı |

### Sık yapılan hata

Şu karşılaştırmayı yazdığını düşün:

```ts
expSeconds <= Date.now()
```

Yeni giriş yapmış olsan bile `Date.now()` çok daha büyük bir sayı olduğu için koşul hemen `true` olur. Arayüz “oturum süresi doldu” diyebilir. `exp` değerini 1000 ile çarpıp iki değeri de milisaniye yap; ayrıca istemcinin bu hesabı yapması imza kontrolünün yerini tutmaz.

Bir başka gerçek hata da tüm JWT dizgisini `atob()` ile açmaya çalışmaktır. Noktalar nedeniyle bu geçerli bir Base64 metni değildir. Payload'ı okumak gerektiğinde önce noktalardan ayırıp ikinci parçayı seçmek, Base64URL karakterlerini çevirmek ve eksik `=` dolgularını tamamlamak gerekir. Bu dönüştürme birkaç küçük adımdan oluşur; normal uygulama kodunda hazır, bakımı yapılmış bir yardımcı kullanmak daha anlaşılırdır.

:::info[Derinlemesine (isteğe bağlı)]
JWT'de Base64URL, `+` yerine `-`, `/` yerine `_` kullanır ve sondaki `=` dolgusunu atabilir. Eski tarayıcı API'si `atob()` standart Base64 beklediği için elle decode eden kod bu karakterleri çevirmeli ve metni JSON olarak ayrıştırmalıdır. İmza algoritmasının ayrıntıları ile `alg: none` saldırısı sunucudaki JWT kütüphanesi ve yapılandırmasıyla ilgilidir; istemcide bu ayrıntıları çözmeye çalışma.
:::

## Aklında kalsın

- JWT üç parçadır: `Header`, `Payload` ve `Signature`.
- Payload okunabilir kodlanmış veridir; şifreli değildir, içine sır koyma.
- Decode değerleri okumaktır; verify imzayı denetlemektir ve bunu sunucu yapar.
- `exp` saniye, `Date.now()` milisaniyedir; karşılaştırmadan önce `exp * 1000` kullan.

**Yeni terimler**

- **JWT:** Sunucunun imzaladığı, isteklerde taşınabilen üç parçalı token biçimi.
- **Header:** Token türü ve imzalama yöntemi hakkında bilgi taşıyan ilk parça.
- **Payload:** Kullanıcı ve zaman gibi okunabilir verileri taşıyan ikinci parça.
- **Signature:** İlk iki parçanın sunucu anahtarıyla imzalanmış halini taşıyan üçüncü parça.
- **Decode / verify:** Decode veriyi okumak; verify imzanın geçerliliğini denetlemektir.

**Kendini yokla:** Payload'da `role: "admin"` okudun. Bu, API'de yönetici olduğunun kanıtı mı?  
**Cevap:** Hayır. İstemci payload'ı okuyabilir ama imzayı doğrulayamaz; API yetkisini sunucu denetler.

**Kendini yokla:** `exp` saniye, `Date.now()` milisaniye ise hangisini çevirmelisin?  
**Cevap:** `exp` değerini 1000 ile çarpar, sonra iki milisaniye değerini karşılaştırırsın.
