---
title: "Tipin göremediği veri"
minutes: 12
kind: concept
---

# Tipin göremediği veri

Sinema uygulamasında bir filmi API'den alıp kartta gösteriyorsun. Kodda title alanını string diye yazmış olabilirsin; ama bu yazı, sunucunun gerçekten metin gönderdiğini kontrol etmez. Bunu anlamak için tanıdık bir TypeScript örneğinden başlayalım.

## Tip, gerçek veriyi kontrol etmez

TypeScript, kodu yazarken alanları doğru kullanmana yardım eder. Uygulama çalışırken bu tip açıklamaları JavaScript'ten silinir. API cevabı ise o anda gelir; derleyici cevabı önceden göremez.

![TypeScript tiplerinin derlemede silinip API verisinin çalışma anında doğrulanması gerektiğini gösteren akış](diagram:ts-derleme-ve-calisma)

```ts check
type Movie = { title: string }
const raw: unknown = JSON.parse('{"title":null}')
const movie = raw as Movie
console.log(movie.title.toUpperCase())
```

Bu kodun derlenmesi, raw içindeki değeri değiştirmez: movie.title hâlâ null olur. as Movie yalnızca “bu değeri Movie gibi kullanacağım” iddiasıdır. toUpperCase() çağrısında uygulama hata verir; çünkü gerçek değer string değildir.

Buradaki unknown, henüz biçimini kanıtlamadığımız değerin dürüst tipidir. Bu değeri kullanmadan önce kontrol etmen gerekir. Bir API cevabını baştan Movie diye adlandırmak daha kısa görünür, ama yanlış cevaba karşı koruma sağlamaz. TypeScript sana uygulama kodunda yardımcı olur; sunucunun göndereceği değeri önceden görmez.

## Aynı iddia generic fonksiyonda da var

Bir generic, fonksiyona çağrıldığı yerde değişebilen bir tip parametresi ekler. T gibi bir ad, fonksiyonun değerleri nasıl kullandığını tarif edebilir; ancak kendi başına gelen JSON'u incelemez.

```ts check
function movieTitle<T extends { title: string }>(movie: T): string {
  return movie.title.toUpperCase()
}

const movie = JSON.parse('{"title":null}') as { title: string }
console.log(movieTitle(movie))
```

Fonksiyonun çağrıldığı yerde TypeScript, title alanının string olduğunu kabul eder ve fonksiyonun alanı kullanmasına izin verir. Fakat JSON.parse satırında dış veriyi kontrol etmedik; title yine null olduğundan çağrı çalışma anında hata verir. Generic'i bu kez hasarlı veriye temas eden başka bir fonksiyonda gördük: kısıt yazmak bile sunucu cevabını sınamıyor. Generic kullanışlıdır, fakat onu veri denetimiyle karıştırmamalısın.

Bir fonksiyonun çağrıldığı tip ile çalışması, API sözleşmesini doğruladığı anlamına gelmez. Tip bilgisi uygulama kodunun parçaları arasında taşınır; gerçek cevapla karşılaştırma ayrıca yapılmalıdır. Burada ilk örneğe göre tek yenilik, aynı temelsiz varsayımın bir yardımcı fonksiyonun arkasında da saklanabilmesidir.

## Küçük bir kontrol neyi kanıtlar?

Bu kez JSON'u unknown tutup başlığın türünü gerçekten kontrol edelim. Bir type guard, değerin belli bir biçimde olduğunu sınayan ve TypeScript'e bu sonucu bildiren kontroldür; burada da her iki işi yapıyor.

```ts check
type Movie = { title: string }

function isMovie(value: unknown): value is Movie {
  return typeof value === 'object' && value !== null &&
    'title' in value && typeof value.title === 'string'
}

const raw: unknown = JSON.parse('{"title":"Gece Yolculuğu"}')
if (isMovie(raw)) console.log(raw.title.toUpperCase())
```

Kontrol başarılıysa raw.title string'dir ve onu güvenle kullanabilirsin. Fakat bu kontrol sadece başlığı sınar. Poster yolu, puan veya iç içe bir oyuncu listesi de kullanacaksan her birini ayrıca kontrol etmen gerekir. Küçük bir cevap için bu açık olabilir; alanlar arttıkça kontrol fonksiyonu uzar. Güvence, kontrolün gerçekten baktığı alanlarla sınırlıdır.

| Sıra | Ne çalışır? | raw hakkında ne biliyoruz? |
| --- | --- | --- |
| 1 | JSON metni nesneye çevrilir | Hâlâ unknown; alanlara güvenemeyiz |
| 2 | isMovie(raw) nesne ve title alanını sınar | Kontrol henüz tamamlanmadı |
| 3a | Kontrol true döner | title kesinlikle string |
| 3b | Kontrol false döner | Değeri film başlığı gibi kullanmayız |
| 4 | Başarılı kolda toUpperCase() çalışır | String üzerinde güvenli kullanım |

Bu sırada önce dış veriyi sınar, sonra alanı okuruz. Kontrol başarısızsa ekrana bozuk başlığı göndermek yerine sınırda hata yolu seçilebilir. “Hata sınırda görünür” demek, bozuk verinin uygulamanın içinde ilerlemeden kaynağa yakın yerde reddedilmesidir. Bu tercih hatayı daha erken ve veriyi ilk alan yerde görünür kılar.

## Sinema'da kontrolü nereye koyarsın?

API cevabını birden fazla film kartı kullanıyorsa her kartın kendi kontrolünü yazması kolayca tutarsızlık yaratır. Veriyi alan API client'ta kontrol edip doğrulanmış sonucu döndürmek, bütün kartların aynı kurala uymasını sağlar. Bu giriş noktasına uygulamanın sınırı diyebiliriz: dış dünyanın değeri, uygulamanın kendi koduna burada girer.

![Bilinmeyen dış verinin doğrulamadan sonra tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

Bir film detay sayfasında başlık veya puan beklenen biçimde değilse, detay verisini hatalı sonuç olarak işaretlemek mantıklıdır. Tek bir küçük poster bilgisi bozuksa kart yedek görsel gösterebilir. Kontrolün kendisi aynı soruyu yanıtlar—“bu değer beklenen biçimde mi?”—ama hatayı kullanıcıya nasıl göstereceğin ekranın ihtiyacına bağlıdır. Veriyi reddetmek ve kullanıcıya ne göstermek gerektiği iki ayrı karardır.

Örneğin başlık eksik geldiğinde kartın boş bir `h1` göstermesi, hatayı ortadan kaldırmaz; yalnızca daha az görünür yapar. Kaynağa yakın yerde durdurursan log veya hata durumu, sorunun film cevabında olduğunu daha erken gösterir. Bir yedek metin seçiyorsan da bunu doğrulama başarılıymış gibi yapmak yerine kartın bilinçli görünüm kararı olarak uygula.

El yazımı kontroller doğru çalışabilir, ancak her alan için tür, eksiklik ve olası alt değerleri takip etmek gerekir. Bir başlık kontrolü, nesnenin kalan alanlarını veya dizi elemanlarını kendiliğinden doğrulamaz. Sonraki derste bu kuralları bir şemada tarif edip gerçek değere uygulayacağız. Şema, kontrolün yerine geçen bir tip etiketi değil; değeri gerçekten sınayan tarif olacak.

## Yanlış giden kısa yol

:::mistake[Generic'i API garantisi sanmak]
**Belirti →** Kod derlenir ama title.toUpperCase() sırasında çöker. **Neden →** Çağrıda verilen tip parametresi cevabı incelemedi. **Düzeltme →** Dış cevabı unknown kabul et ve uygulama içinde kullanmadan önce gerçek kontrol uygula.
:::

## Özet

- TypeScript tipi derleme sırasında yardım eder; API cevabını çalışırken kontrol etmez.
- as Movie ve getJson<Movie>() gerçek veriye kanıt eklemez.
- unknown değeri kullanmadan önce kontrol et; başarılı kontrolden sonra güvenli biçimde kullan.
- Kontrolü dış verinin uygulamaya girdiği yerde yapmak, hatanın yayılmasını önler.

**Yeni terimler:**
- unknown: Biçimi henüz bilinmeyen ve kontrol edilmeden kullanılamayan değer.
- generic: Bir fonksiyonun çağrılırken belirlenen tip parametresi.
- type guard: Değerin biçimini sınayıp sonucu TypeScript'e bildiren kontrol.
- uygulama sınırı: Dış verinin uygulama koduna ilk girdiği yer.

**Kendini yokla:** getJson<Movie>() cevabın Movie olduğunu kanıtlar mı?
*Cevap:* Hayır. Generic yalnızca tip iddiası taşır; gerçek değeri kontrol etmez.

**Kendini yokla:** isMovie yalnızca title alanını sınarsa posterPath alanına güvenebilir misin?
*Cevap:* Hayır. Yalnızca kontrol ettiği biçim hakkında güvence verir.
