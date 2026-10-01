---
title: "API sınırında doğrula"
minutes: 15
kind: concept
---

# API sınırında doğrula

Sinema'da film listesini `fetch` ile alırken iki ayrı soruya cevap ararsın: Sunucu isteği kabul etti mi? Dönen JSON, ekranın kullanacağı film verisine benziyor mu? `response.ok` ilk soruyu cevaplar; ikinci soruyu cevaplamaz. İkinci kontrolü API client'ta yapacağız: API client, sunucu isteğini ve cevabını uygulamanın geri kalanı için tek bir yerde yöneten fonksiyondur.

## HTTP yanıtı verinin şeklini söylemez

`fetch` yanıtındaki HTTP durumu, isteğin sunucuda başarılı olup olmadığını belirtir. `response.ok`, durum kodu 200–299 aralığındaysa `true` olur. JSON ise sunucunun gönderdiği veri değeridir; durum kodu o değerin alanlarını denetlemez.

En küçük adımda durum kodunu kontrol edip gövdeyi `unknown` alalım. `unknown`, henüz biçimine güvenmediğimiz bir değerin TypeScript tipidir; bu değeri kullanmadan önce kontrol etmemiz gerektiğini hatırlatır.

```ts check
async function readFilmResponse(path: string) {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const raw: unknown = await response.json()
  return raw
}
```

Bu fonksiyon 404 gibi bir HTTP hatasını hemen durdurur. Fakat 200 ile `{ runtime: "uzun" }` gelirse onu da döndürür; çünkü henüz `raw` değerinin alanlarına bakmadık. TypeScript'e `raw as MovieDetails` yazmak da bunu düzeltmez: bu ifade yalnızca derleyiciye iddiada bulunur, JSON'u çalışırken incelemez.

![API'den gelen bilinmeyen verinin doğrulamayla tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

## Şema başarılı yanıtı da kontrol eder

Şimdi Sinema'nın film detayında kullanılan süre ve türleri bir Zod şemasıyla denetleyelim. `parse`, gerçek değeri şemaya göre kontrol eder: uygunsa doğrulanmış değeri döndürür, değilse hata fırlatır.

```ts check
import { z } from 'zod'

const detailSchema = z.object({
  runtime: z.number().int().positive(),
  genres: z.array(z.string()),
})

async function readFilmDetails(path: string) {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const raw: unknown = await response.json()
  return detailSchema.parse(raw)
}
```

Bu örnekte HTTP hatası `parse` satırına gelmeden durur. HTTP başarılı olsa bile `runtime` metinse `parse` hata verir; böylece bozuk değer film detayına başarı verisi olarak ulaşmaz. Dönen değer artık şemadan geçtiği için TypeScript `runtime` alanını number, `genres` alanını string listesi olarak bilir.

Buradaki önemli karar, `parse` çağrısını bileşende değil, API client'ın dönüşünden önce yapmaktır. Böylece bu endpoint'i kullanan her ekran aynı doğrulamayı tekrar yazmaz ve Query cache'e yalnızca doğrulanmış sonuç ulaşır.

## Yanıtı satır satır izleyelim

Bir film ayrıntısı isteğinin 200 döndürdüğünü, fakat `runtime` alanının metin olduğunu düşün. Kontroller şu sırayla çalışır:

| Adım | Kodun yaptığı | Örnek değer | Sonuç |
| --- | --- | --- | --- |
| 1 | `fetch(path)` tamamlanır | `status: 200` | Bir yanıt var; veri henüz doğrulanmadı |
| 2 | `response.ok` okunur | `true` | HTTP hatası yok, gövdeyi okuyabiliriz |
| 3 | `response.json()` çağrılır | `{ runtime: "uzun" }` | JSON değeri geldi; biçimine henüz güvenmiyoruz |
| 4 | `detailSchema.parse(raw)` çalışır | `runtime` string | Şema number beklediği için hata oluşur |
| 5 | API client Promise'i reddedilir | doğrulama hatası | Query bunu başarı verisi yerine hata olarak görür |

Parse işlemi dönüşten önce olduğu için son adımda bozuk film `data` olarak cache'e girmez. Şemayı ekran render ederken çalıştırsaydık ham cevap önce başarı gibi ilerlemiş olurdu; her ekran da kendi doğrulamasını yapmak zorunda kalırdı.

## Liste hatasında alan yolunu bul

Bazen yanıtı atmak yerine kontrollü bir hata açıklaması üretmen gerekir. Örneğin önerilen oyuncu listesinde hangi oyuncu adının bozuk olduğunu geliştiriciye göstermek isteyebilirsin. `safeParse`, başarılı olduğunda `{ success: true, data }`, başarısız olduğunda `{ success: false, error }` döndürür; beklenen başarısızlığı `try/catch` olmadan iki dalda ele alırsın.

Zod'un hata içindeki tek bir doğrulama bulgusuna `issue` denir. Her issue'nun `path` alanı, hatanın verinin neresinde olduğunu parçalara ayırarak tutar. Örneğin ikinci oyuncunun adı için yol `['cast', 1, 'name']` olur.

```ts check
import { z } from 'zod'

const suggestionsSchema = z.object({
  cast: z.array(z.object({ name: z.string().min(1) })),
})

function describeSuggestions(raw: unknown): string | null {
  const result = suggestionsSchema.safeParse(raw)
  if (result.success) return null
  const path = result.error.issues[0]?.path.join('.') ?? 'yanıt'
  return `Geçersiz alan: ${path}`
}
```

Geçerli listede fonksiyon `null` döndürür; hatalı ikinci ad varsa örneğin `cast.1.name` yolunu açıklar. Burada şema tüm listeyi kontrol ettiği için ilk öğe doğru diye üçüncü öğedeki bozuk değer gözden kaçmaz. Birden fazla sorun varsa ilk issue'yu seçmek bu kısa raporun bilinçli tercihidir; arayüz için tüm hataları toplamak ayrı bir ihtiyaç olabilir.

## Hata türlerini birbirine karıştırma

HTTP hatası ile şema hatası ikisi de isteğin başarıya ulaşmasını engelleyebilir, ama farklı şeyler söyler. HTTP hatası sunucunun isteğe verdiği durumla; şema hatası ise gelen verinin uygulamanın beklediği biçimde olmamasıyla ilgilidir. İkisini de Query hata durumuna taşıyabilirsin, fakat hata nesnesini incelerken bu ayrımı korumak sorunu doğru yerde bulmana yardım eder.

`fetch` 404 veya 500 yanıtlarında kendiliğinden hata fırlatmaz; çoğunlukla bir `Response` ile tamamlanır. Bu nedenle `response.ok` false ise API client'ın hata üretmesi gerekir. Başarılı HTTP cevabı geldikten sonra da JSON'u endpoint'in kendi şemasından geçirirsin. Liste ve detay uçlarının alanlarını birbirinin kopyası sayma: kartın kullandığı alanlar ile detay ekranının kullandığı alanlar farklı olabilir. Her uç için beklediğin zorunlu alanları açıkça tarif etmek, değişiklikte hangi ekran sözleşmesinin bozulduğunu bulmayı kolaylaştırır.

Bir başka gerçek hata, yalnızca listede ilk kaydı kontrol etmektir. Belirti olarak ilk film kartı doğru görünür, ama listenin ilerilerindeki bozuk başlık başka bir ekranda patlar. Neden, doğrulamanın tüm liste yerine tek örnek üzerinde yapılmasıdır; düzeltme, dizinin tamamını şemayla parse etmektir. Yalnızca belirli hatalı öğeleri atlamak istiyorsan bunu ayrıca tasarlamalısın; tüm cevabı sessizce boş nesneye çevirmek bozuk veriyi sağlamış gibi gösterir.

## Özet

- `response.ok` HTTP durumunu kontrol eder; JSON alanlarını doğrulamaz.
- JSON'u `unknown` al, endpoint şemasını `parse` ile uygula ve yalnızca başarılı çıktıyı döndür.
- Doğrulamayı API client'ta yapmak, her ekranı aynı sözleşmeye bağlar ve bozuk verinin Query cache'e girmesini önler.
- `safeParse` başarısızlığında issue'nun `path` değerini birleştirerek hatanın hangi alanda olduğunu anlatabilirsin.

**Yeni terimler**

- **API client:** Sunucu isteği ve cevabını uygulama için tek yerde yöneten fonksiyon.
- **`unknown`:** Biçimi doğrulanana kadar güvenle kullanılamayan değer tipi.
- **Issue:** Zod'un tek bir doğrulama hatası hakkında tuttuğu kayıt.
- **Path:** Hatanın nesne veya dizi içindeki yerini belirten yol parçaları.

**Kendini yokla:** `response.ok` true ise başlığın string olduğunu biliyor muyuz?  
*Cevap:* Hayır; HTTP kontrolünden sonra yanıtı başlık şemasından da geçirmeliyiz.

**Kendini yokla:** İkinci oyuncunun adı bozuksa `['cast', 1, 'name']` neyi söyler?  
*Cevap:* Hata `cast` listesinin 1 indeksindeki öğenin `name` alanındadır.
