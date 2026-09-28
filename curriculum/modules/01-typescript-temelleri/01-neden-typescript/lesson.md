---
title: "TypeScript neden gerekli?"
minutes: 14
kind: concept
---

# TypeScript neden gerekli?

:::pain[Sessiz hatanın bedeli]
Kullanıcı profili ekranında doğum yılını göstermek istiyorsun. JavaScript kodunda `user.brith_date.slice(0, 4)` yazdın. Harf hatası yüzünden `brith_date` alanı bulunamadı; JavaScript bir hata fırlatmak yerine sessizce `undefined` üretti. Ardından gelen `.slice()` çağrısı tarayıcıda `TypeError: Cannot read properties of undefined (reading 'slice')` hatasıyla bütün sayfayı beyaz ekrana gömdü. Hata kod yazılırken değil, ancak bir kullanıcı sayfayı açtığında patladı.
:::

## İki ayrı dünya: Derleme anı ve çalışma zamanı

JavaScript dinamik tipli bir dildir. Bir değişkenin ne tür bir veri tuttuğu kod çalıştırılana kadar bilinmez. Bir nesnenin üzerinde var olmayan bir özelliği okumaya kalktığında motor bunu olağan kabul eder ve `undefined` döndürür. Bu sessizlik ilk anda bir kolaylık gibi görünse de hatanın kaynağını gizler; sorun tam o satırda değil, üç fonksiyon sonra o değer bir metin veya sayı gibi kullanılmaya çalışıldığında ortaya çıkar.

TypeScript bu sorunu çözmek için JavaScript'in üzerine **statik bir tip katmanı** ekler. Ancak TypeScript'i doğru kullanabilmek için en temel zihinsel modeli kavramak şarttır: **TypeScript derleme zamanında (compile-time) yaşar, çalışma zamanında (runtime) tamamen yok olur.**

Bu model dört kesin kural üzerine kuruludur:

1. **Yazım anı denetimi:** Sen kodu yazarken TypeScript derleyicisi (`tsc`) nesnelerin şeklini, fonksiyonların parametrelerini ve dönüş değerlerini analiz eder. Tanımlamadığın bir alan adı yazdığında hatayı daha çalıştırmadan kırmızı çizgiyle işaretler.
2. **Tip silinmesi (Type Erasure):** TypeScript kodu JavaScript'e dönüştürülürken (`build` anında) yazdığın tüm `type`, `interface` ve tip ekleri dosyadan tamamen silinir. Tarayıcıya giden saf JavaScript kodunda tiplerden eser kalmaz.
3. **Sıfır çalışma zamanı maliyeti:** Tipler çalışma anında var olmadığından uygulamanın hızını düşürmez; fakat aynı nedenle çalışma anında hiçbir koruma sağlamaz.
4. **Dış dünyanın belirsizliği:** API'den, kullanıcı formundan ya da `localStorage`'dan gelen veriler TypeScript'in derleme anındaki varsayımlarına uymak zorunda değildir. Tip tanımlamak veriyi dönüştürmez ya da doğrulamaz; yalnızca kodun geri kalanına o verinin şekli hakkında verdiğin sözü belgeler.

![TypeScript derleme ve çalışma zamanı sınırı](diagram:ts-derleme-ve-calisma "Derleme zamanı ile çalışma zamanı arasındaki kesin sınır")

Bu diyagram iki katman arasındaki sınırı gösterir. Üst şeritte TypeScript derleyicisi kaynak kodunu denetler ve saf JavaScript üretir. Alt şeritte ise tarayıcı çalışır. API'den gelen gerçek verinin senin yazdığın tiplere uyup uymadığını kontrol etmek için çalışma zamanında açık kod yazman gerekir.

## Bir hatanın anatomisi: Adım adım iz sürelim

Bir kitap kulübü uygulamasında kitapların basım yılını ekranda göstermek istediğimizi düşünelim. Geliştirici nesne üzerindeki `publication_date` alanı yerine yanlışlıkla `pub_date` yazmış olsun. Bu hatanın saf JavaScript ile TypeScript arasındaki serüvenini adım adım izleyelim:

| Aşama | Saf JavaScript | TypeScript |
| --- | --- | --- |
| **1. Kodu Yazarken** | Editör sessizdir. `book.pub_date` ifadesi sıradan bir özellik erişimi olarak kabul edilir. | Editör tanımlı `Book` tipine bakar. `pub_date` alanının olmadığını görür ve altını kırmızıyla çizer. |
| **2. Derleme / Kaydetme** | Kod doğrudan tarayıcıya iletilir; hiçbir itiraz veya uyarı oluşmaz. | `tsc` derleyicisi hata fırlatır: `Property 'pub_date' does not exist on type 'Book'. Did you mean 'publication_date'?` Derleme durur. |
| **3. Çalışma Anı** | JavaScript nesnede alanı bulamaz, sessizce `undefined` üretir. | Hata derleme anında düzeltildiği için çalışma zamanına yanlış alan adı sızamaz. |
| **4. Yan Etki ve Çökme** | `undefined.slice(0, 4)` çalıştırıldığı anda tarayıcıda `TypeError` fırlatılır; bileşen ağacı çöker. | Kod güvenli sözleşmeye uygun çalıştığı için ekranda beklenen yıl doğru şekilde görünür. |

JavaScript'te hata kullanıcıya kadar ulaşırken, TypeScript'te geliştiricinin terminalinde veya editöründe daha ilk saniyede yakalanır.

## Önce kırık: Sessizliğin bedeli

Şimdi bu durumu somut bir kod parçası üzerinde görelim. Aşağıdaki kırık örnekte, JavaScript nesnesi üzerinde yapılan alan hatasının nasıl hiçbir hata vermeden ilerleyip daha sonra patladığına dikkat et:

```ts
// Kırık JavaScript senaryosu:
const book = {
  title: 'Kırmızı Saçlı Kadın',
  publication_date: '2016-06-01',
}

// Geliştirici alan adını yanlış hatırladı:
function getPublicationYear(item: any) {
  // item.pub_date tanımlı değil -> sessizce undefined döner
  const date = item.pub_date
  // undefined üzerinde string metodu çağırmak çalışma zamanında ÇÖKER:
  return date.slice(0, 4)
}

// getPublicationYear(book) -> Uncaught TypeError!
```

Burada `any` kullanmak ya da saf JavaScript çalıştırmak, derleyicinin gözünü bağlar. Fonksiyon `item` nesnesinin içini bilemez ve `pub_date` alanına güvenmek zorunda kalır.

## Doğru yöntem: Sözleşmeyi baştan kurmak

Aynı senaryoyu açık bir nesne tipiyle yazdığımızda derleyici bizim adımıza nöbet tutmaya başlar. `Book` tipini tanımladığımızda, bu tipe uyan herhangi bir nesneye erişirken alan adları garanti altına alınır:

```ts check
type Book = {
  title: string
  publication_date: string
}

function getBookYear(book: Book): string {
  // book.publication_date geçerlidir; tsc yazım hatalarına izin vermez
  if (book.publication_date === '') {
    return 'Yıl belirtilmemiş'
  }
  return book.publication_date.slice(0, 4)
}

const currentBook: Book = {
  title: 'Kırmızı Saçlı Kadın',
  publication_date: '2016-06-01',
}

const release = getBookYear(currentBook)
void release
```

Bu kodda üç önemli detay vardır:

1. `Book` tipi nesnenin hangi alanları hangi türde taşıyacağını açıkça ilan eder.
2. `getBookYear` fonksiyonu yalnızca bu sözleşmeye uyan nesneleri kabul eder. Fonksiyon gövdesinde `book.pub_date` yazarsan TypeScript derlemesi anında durur.
3. Tip tek başına boş string (`""`) olasılığını ortadan kaldırmaz. `publication_date: string` demek o alanın metin olduğunu söyler; metnin boş olup olmadığını kontrol etmek yine çalışma zamanındaki `if (book.publication_date === '')` mantığının sorumluluğudur.

## Sınır durumları ve sık yapılan hatalar

:::mistake[Tip yazmayı çalışma zamanı doğrulaması sanmak]
- **Belirti:** `user.avatar_url.startsWith('https')` satırında tarayıcının `Cannot read properties of null` hatasıyla çökmesi.
- **Neden:** Arayüzde `avatar_url: string` tanımlanmış olsa bile, backend veritabanından `null` gönderebilir. TypeScript tipleri JavaScript çalıştığı sırada devrede olmadığı için sunucudan gelen `null` değeri sessizce değişkene atanır.
- **Düzeltme:** Gerçek verinin `null` gelebileceğini tipe yansıt (`avatar_url: string | null`) ve metot çağırmadan önce `if (user.avatar_url === null)` kontrolünü yap.
:::

:::mistake[Vite ekranı gösterdi diye tip hatası olmadığını varsaymak]
- **Belirti:** Geliştirme ortamında tarayıcıda sayfa açılırken, CI/CD sunucusunda veya `pnpm build` sırasında derleme hataları çıkması.
- **Neden:** Vite geliştirme sunucusu yüksek hız için tipleri kontrol etmeden doğrudan JavaScript'e çevirir (transpile / strip eder). Tip hataları Vite'ın ekran çizmesini tek başına engellemez.
- **Düzeltme:** Editördeki kırmızı alt çizgileri görmezden gelme; belirli aralıklarla terminalde `pnpm typecheck` çalıştırarak gerçek `tsc` denetimini doğrula.
:::

:::mistake[Falsy kontrolleriyle geçerli değerleri yutmak]
- **Belirti:** Sayısal bir alan `0` veya boş metin `""` olduğunda uygulamanın beklenmedik şekilde "Değer yok" uyarısı üretmesi.
- **Neden:** `if (!value)` yazmak `null` ve `undefined`'ın yanı sıra `0`, `""` ve `false` değerlerini de kapsar.
- **Düzeltme:** Kontrol etmek istediğin durumu açık yaz: boş string için `value === ''`, yokluk için `value === null || value === undefined`.
:::

:::sector[Sektörde nasıl uygulanır?]
Profesyonel ekiplerde kod tabanına giren her pull request otomatik bir entegrasyon hattından (CI) geçer. Bu hattın ilk adımı her zaman `tsc --noEmit` komutudur. Tek bir tip hatası dahi bulunsa kodun yayına çıkmasına izin verilmez. 

Ayrıca modern ekipler iki kuralı kesin olarak birbirinden ayırır: Kod içi fonksiyonlar ve bileşenler arasındaki iletişim TypeScript tipleriyle korunur; ancak uygulamanın dış dünyayla (API, kullanıcı formları, URL parametreleri) temas ettiği sınır noktalarında çalışma zamanı doğrulayıcıları (ileride göreceğimiz Zod gibi araçlar) kullanılır.
:::

## Özet

- JavaScript var olmayan alanlara erişildiğinde sessizce `undefined` üretir ve hataları çalışma zamanında patlatır.
- TypeScript derleme anında çalışır; nesnelerin şekil ve tip sözleşmelerini kod çalışmadan önce denetler.
- Tipler JavaScript çıktısında yer almaz (type erasure); çalışma zamanında bellekte yer tutmaz ve performansı etkilemez.
- TypeScript tipi tanımlamak veriyi çalışma zamanında dönüştürmez veya doğrulamaz; dış dünyadan gelen verideki boşlukları kontrol etmek kodun görevidir.

### Kendini yokla

**Soru 1:** Bir nesne tipinde `discount_rate: number` tanımlanmışsa, bu alanın çalışma zamanında `undefined` gelmeyeceğini TypeScript tek başına garanti edebilir mi?  
*Cevap:* Hayır. Kodun kendi içinde `Book` nesnesi oluştururken TypeScript zorunlu alanları denetler; ancak bu veri dışarıdan (örneğin bir fetch isteğinden) geliyorsa ve backend alanı göndermediyse, tipler çalışma anında silindiği için değer `undefined` olarak gelir ve çalışma zamanında çökmelere yol açabilir.

**Soru 2:** Geliştirme yaparken Vite arayüzde bileşeni gösteriyor ama terminalde `pnpm typecheck` hata veriyor. Hangi aracın söylediği doğrudur?  
*Cevap:* `pnpm typecheck` (yani `tsc`) doğrudur. Vite geliştirme hızını korumak için tip denetimi yapmadan kodları tarayıcıya iletir. Gerçek tip güvenliği denetimini yalnızca TypeScript derleyicisi sağlar.
