---
title: "Tek testte farklı sunucu cevapları"
minutes: 14
kind: concept
---

# Tek testte farklı sunucu cevapları

Sinema araması normalde film listesi döndürüyor olabilir; peki kullanıcı aradığında hiç film bulunmazsa veya servis hata verirse? Gerçek servisi bozmayı beklemek yerine, önceki derste gördüğün MSW handler’ını yalnızca ilgili testte değiştirirsin. Böylece aynı component farklı sunucu cevaplarıyla çalışır.

En basit durumda, bir test için tek bir cevap ekleyebilirsin:

```ts
server.use(
  http.get(`${TMDB_BASE}/search/movie`, () =>
    HttpResponse.json({ status_message: 'Arama başarısız' }, { status: 503 }),
  ),
)
```

Bu kod ortak varsayılan handler’ın üstüne o test için özel bir cevap koyar. Arama endpoint’ine bu test sırasında istek gelince 503 ve JSON gövdesi döner. HTTP status ile JSON gövdesi ayrı parçalardır: status isteğin başarılı olup olmadığını, gövde ise uygulamanın okuyacağı veriyi taşır. Testten sonra `resetHandlers()` çalıştığı için bu override sonraki teste kalmaz.

:::model[MSW perdesi]
Uygulamanın gerçek `fetch` isteği MSW handler'ına ulaşır; handler kontrollü status ve gövdeyi cevaplar. `server.use` bu akışın yalnızca testteki cevabını değiştirir.

![Uygulama isteğinden handler cevabına MSW akışı](diagram:msw-perdesi)
:::

Boş listeyi hata ile karıştırma. 200 ve `results: []`, istek başarılı oldu fakat eşleşen film yok demektir. 503 ise sunucu isteği beklenen biçimde tamamlayamadı. Kullanıcıya “sonuç bulunamadı” ile “sonuç alınamadı” göstermek farklı bilgi verir.

## Status değerini parametre yap

Bazen benzer cevapları farklı status kodlarıyla tekrar kullanmak istersin. Böyle bir durumda **factory**, girdi alıp tekrar kullanılabilir bir şey oluşturan fonksiyondur. Aşağıda verilen status ile MSW handler’ı üreten küçük bir fonksiyon var:

```ts
function makeWatchlistErrorHandler(status: number) {
  if (!Number.isInteger(status) || status < 400 || status > 599) {
    throw new RangeError('status bir hata kodu olmalı')
  }

  return http.get(`${TMDB_BASE}/account/watchlist`, () =>
    HttpResponse.json({ message: 'İzleme listesi alınamadı' }, { status }),
  )
}
```

Şimdi aynı handler yapısını 503 ya da 429 gibi farklı hata kodlarıyla izleme listesi endpoint’i için kurabilirsin. Fonksiyon önce değerin tam sayı ve 400–599 aralığında olduğunu denetliyor; geçerli değilse daha test kurulurken `RangeError` fırlatıyor. Bu kontrol, `200` gibi başarı kodunun yanlışlıkla hata cevabı olarak kullanılmasını önler. Status’u değiştirsek de endpoint ve hata gövdesi aynı kalır.

Handler eşleşmesi için method ve URL önemlidir. `http.get` yalnız GET isteğini, `/search/movie` yalnız o yolu karşılar. Query string, örneğin `?query=Matrix`, path’e dahil değildir; handler `new URL(request.url).searchParams` üzerinden ayrıca okuyabilir. Bu ayrım sayesinde yalnız aranan sorguya göre farklı sonuç üretmek mümkündür.

## Query’den boş ve gecikmeli cevap üret

Sinema aramasında boş sonuç döndürürken istenen sayfa numarasını korumak isteyebilirsin. Handler’ın query’den değer okuyup cevapta kullanması bir adım daha ekler:

```ts
http.get(`${TMDB_BASE}/search/movie`, ({ request }) => {
  const url = new URL(request.url)
  const rawPage = url.searchParams.get('page')
  const page = rawPage === null ? 1 : Number(rawPage)

  if (!Number.isInteger(page) || page < 1) {
    return HttpResponse.json({ status_code: 22 }, { status: 400 })
  }

  return HttpResponse.json({
    page,
    results: [],
    total_pages: 1,
    total_results: 0,
  })
})
```

`URLSearchParams` değerleri string verir, bu yüzden `Number(...)` ile sayıya çeviriyoruz. `page=2` geçerliyse cevapta `page: 2` kalır; parametre yoksa 1 kullanılır. `page=0`, `page=1.5` veya sayıya çevrilemeyen metin geçerli sayfa değildir ve 400 ile döner. Boş `results` dizisi her durumda aynı liste envelope’unu korur.

Handler yanıtını geciktirmek için MSW 2’de `delay` kullanabilirsin. Bu, yavaş sunucu yanıtı boyunca loading durumunun görünmesini sağlayan kontrollü gecikmedir:

```ts
http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)

  await delay(120)
  return HttpResponse.json({
    page,
    results: [],
    total_pages: 1,
    total_results: 0,
  })
})
```

Burada handler önce istek bilgisini okur, 120 ms bekler, sonra cevabı verir. Bu bekleme uygulamanın gerçek performansını ölçmez; testte loading anını gözlemleyebilmen için sunucu davranışı kurar. Arayüzdeki sonucu beklemek için yine `findBy` gibi DOM koşuluna dayalı sorgu kullan.

| Sıra | Olay | Gözlenen sonuç |
|---|---|---|
| 1 | Component arama isteği gönderir | UI loading durumuna geçer |
| 2 | Handler query’yi okur | `page` sayıya çevrilir ve doğrulanır |
| 3 | `delay(120)` tamamlanana kadar beklenir | Loading görünmeye devam eder |
| 4 | Handler 200 boş listeyi döndürür | Component boş sonuç durumunu gösterir |

Bu sıra bir testin neyi kanıtladığını da açıklar: loading’i görebilmek için kontrollü gecikme gerekir; ama gecikme süresini assertion ile ölçmek gerekmez. Kullanıcıya dönük test, beklenen loading veya boş sonuç metnini arar.

:::mistake[Boş sonucu sunucu hatası saymak]
Belirti → Arama eşleşme bulmayınca hata mesajı çıkıyor.
Neden → Boş listeye 503 gibi hata status’u verilmiş veya component boş `results` durumunu ele almamıştır.
Düzeltme → Başarılı boş listeyi 200 ve boş `results` ile dön; sunucu hatasını ayrı ele al.
:::

:::mistake[Query değerini doğrulamadan kullanmak]
Belirti → `page=0` cevabı geçerliymiş gibi ekranda sayfa 0 görünür ya da uygulama beklenmedik veri işler.
Neden → Query değeri string’den sayıya çevrilmiş ama tam sayı ve alt sınır kontrolü yapılmamıştır.
Düzeltme → `Number.isInteger(page)` ve `page < 1` koşullarını cevap üretmeden önce kontrol et.
:::

:::mistake[Handler sonraki teste sızıyor]
Belirti → Önceki testteki 503, normal başarı bekleyen başka bir testi bozuyor.
Neden → Runtime override temizlenmemiştir.
Düzeltme → Test lifecycle’ında `server.resetHandlers()` çalıştır; her test özel cevabını kendi içinde kursun.
:::

:::info[Derinlemesine (isteğe bağlı)]
HTTP 503 ile ağ bağlantısının kurulamaması farklı durumlardır: 503’te `fetch` bir `Response` ile tamamlanır; bağlantı hatasında Promise reject olabilir. MSW’de `HttpResponse.error()` ağ hatası simüle edebilir. Yalnızca uygulamanın bu ayrı yolu için özel bir davranışı varsa böyle bir test ekle.
:::

## Özet

- `server.use` yalnız mevcut test için özel cevap ekler; `resetHandlers()` başlangıç durumunu geri getirir.
- Boş başarılı arama ile HTTP hata cevabı farklı kullanıcı durumlarıdır.
- Factory fonksiyonu parametreye göre handler üretmeyi sağlar.
- Query değeri string gelir; kullanmadan önce sayı dönüşümü ve geçerlilik kontrolü yap.
- `delay` yükleme anını gözlemlemeye yardım eder; sonucu sabit süre uykusuyla değil DOM koşuluyla bekle.

**Yeni terimler**

- **Override:** Bir test için ortak handler’ın yerine geçici cevap koyma.
- **Factory:** Girdi alıp tekrar kullanılabilir bir nesne veya handler üreten fonksiyon.
- **Query parameter:** URL’de `?` sonrasında taşınan istek değeri; handler’da ayrıca okunur.

**Kendini yokla:** `page=2` boş sonuç cevabında neden `page: 2` döndürmelisin?
*Cevap:* API cevabı istenen sayfayı korumalıdır; boş sonuç olması sayfa bilgisini kaybettirmez.

**Kendini yokla:** `delay(120)` kullandıysan başlığın tam 120 ms’de göründüğünü test etmeli misin?
*Cevap:* Hayır. Gecikme yükleme davranışını görünür kılar; test beklenen DOM durumunu aramalıdır.
