---
title: "Query key ile doğru cevabı eşleştir"
minutes: 15
kind: concept
---

# Query key ile doğru cevabı eşleştir

:::pain[Problem]
Gözlem panosunda `?station=Kuzey` yerine `?station=Güney` yazıyorsun. Başlıktaki istasyon değişiyor ama ölçüm listesi Kuzey’e ait kalıyor. İki isteğin de key’i `['readings']`; cache, hangi cevabın hangi filtreye ait olduğunu ayıramıyor.
:::

## Key, cevabın kimlik kartıdır

TanStack Query cache’i sonuçları query key’lerine göre bulur. Bu nedenle key sadece gruplama etiketi değildir: “Bu veri hangi girdilerle üretildi?” sorusunun cevabıdır. Aynı key ve aynı sorgu tanımı aynı cache girdisini paylaşır. Sonucu değiştirecek bir değer değişirse key de değişmelidir.

:::model[URL state ile server state]
Filtreyi adres çubuğunda tutmak paylaşım ve geri tuşu davranışı sağlar; API cevabı Query cache’inde kalır. Key, URL’den çözümlenen filtrelerin cevaba etkisini kaydeder. Yeni bağlamda URL’yi cache’in kendisi yapmıyoruz; URL’deki parametrelerle cache girdisini birbirine bağlıyoruz.
:::

Bir key genellikle en az bir parçalı bir array’dir. Kaynağın ailesini başa, alt kaynağı ve onu seçen parametreleri devamına koy. Örneğin `[ 'readings', 'station', 'North' ]` belirli istasyonu; `[ 'readings', 'station', 'South' ]` başka bir sonucu temsil eder. Sıralama ekipte key ailelerini tanımayı ve gerektiğinde alt aileleri seçmeyi kolaylaştırır.

![Query key parçalarının farklı cache girdilerine eşlenmesi](diagrams/query-key-cache.svg "Bir parametre değişince ayrı cache girdisi oluşur.")

Kurallar kesin olsun:

1. **Cevaba etki eden her girdi key’de bulunur.** Arama metni, sayfa, filtre, sıralama veya route id sonucu değiştiriyorsa key’e girer.
2. **Aynı normalize edilmiş girdiler aynı key’i üretir.** Baş ve sondaki boşlukları önemsiz sayıyorsan istekten önce ve key’de aynı biçime getir.
3. **Query function key ile uyumlu parametrelerden veri alır.** Closure’da `station` okuyup key’den çıkarmak, aynı cache kimliği altında farklı cevapları yazdırabilir.
4. **Key’in tüm parçaları serileştirilebilir değerler olur.** DOM düğümü, function veya class instance gibi geçici nesneleri key’e koyma.
5. **Array içindeki hiyerarşi kasıtlıdır.** Kaynak ailesi önce, alt tür ve parametreler sonra gelir; farklı ailelerde aynı kelimenin çakışması önlenir.

Bir key’in doğruluğunu kod incelemesinde kontrol etmenin kolay yolu, onu iki soruyla okumaktır: “Bu cevap hangi kaynağa ait?” ve “Hangi seçimler cevabı değiştirdi?” İlk bölümde kaynağın ailesi, devamında seçimi görmelisin. Key’in parçaları endpoint’in kendisi olmak zorunda değildir; örneğin `sort=popular` query string’i ile `['events', 'popular']` key’i aynı veri kararını anlatabilir. Önemli olan iki biçimin aynı isteğe karşılık gelmesidir.

Bir parametre cevabı yalnızca dolaylı yoldan değiştiriyor gibi görünse de onu unutma. `language=tr-TR` ve `language=en-US` farklı başlık üretir; `includeArchived=false` ile true farklı kayıt kümesi verir. Bir parametreyi key’den çıkarmak bazen bilerek yapılabilir—örneğin UI cevabı etkilemiyorsa—ancak API isteğine ekleyip key’de tutmamak tutarsız cache üretir. Cevabı etkileyen parametreyi değiştirmek aynı key’den farklı data dönmesine sebep olmamalıdır.

Query key’ler içinde nesne parametreleri kullanmak mümkündür. Query nesne alanlarının sırasını cache hashing için normalize eder, fakat array’deki konum önemlidir. Okunabilirlik için filtresi tek nesnede taşımak yararlı olabilir; yine de o nesne yalnızca sonucu etkileyen değerlerden oluşsun. Nesnenin içine `Date` veya `URLSearchParams` gibi özel nesneler koymak yerine, `page` gibi primitive değerleri ayıkla.

## URL’den anahtara kadar iz sürelim

Tarayıcı adresi `/readings?station=South&page=2` olsun. Component URL’yi okur, sayfa metnini ve numarayı normalize eder, query key’i kurar. Sonra query function bu aynı değişkenleri endpoint’e taşır. Cevap geldiğinde Query yalnızca o key’in girdisini günceller.

| Aşama | Değer | Ne anlama gelir? |
|---|---|---|
| URL | `station=South&page=2` | Kullanıcının seçimi, linkte paylaşılır |
| Parse | `station = 'South'`, `page = 2` | String değerler güvenli hale gelir |
| Key | `['readings', 'station', 'South', 2]` | Cache kimliği oluşur |
| İstek | `/api/readings?station=South&page=2` | Aynı girdiler sunucuya gider |
| Cevap | South istasyonunun ikinci dilimi | Yalnız bu key’e kaydedilir |
| Geri dönüş | Aynı URL ve key | Cache politikası uygunsa aynı girdi okunur |

Bu yolun bir halkası eksikse hata görünür. Key yalnız `station` içerirse sayfa 1 ve 2 birbirine karışır. İstek `page=2` gönderip key’de 1 tutarsa cache, gerçekte aldığı cevabı yanlış kimlik altında saklar. URL’de `page=abc` varsa `Number('abc')` NaN üretir; sınırda bunu varsayılan değere çevirmek, geçersiz isteği önler.

Parse işlemi de önemlidir. `URLSearchParams.get()` `string | null` verir; sayı gibi kullanılan değeri doğrulamadan key’e eklemek, `page='02'` ile `page='2'` için iki farklı temsil üretebilir. İstek API’ye sayıyı `2` olarak gönderirken key string `'02'` tutarsa iki katman birbirinden uzaklaşır. Önce normalize et, sonra hem key hem endpoint URL’inde bu normalize edilmiş değeri kullan. Aynı adım arama kelimesinin boşluklarını temizlerken de geçerlidir.

### Kırık örnek: closure key’in dışından veri seçiyor

```ts
const query = useQuery({
  queryKey: ['readings'],
  queryFn: () => getReadings(station),
})
```

`station` değişip component render olduğunda cache kimliği aynı kalır. TanStack Query bu değişikliğin yeni bir veri isteği anlamına geldiğini anlayamaz. Önceki isteğin cevabı da aynı girdiye gelebileceği için ekranda yanlış istasyon verisini görme riski doğar.

### Doğru biçim: kimliği açık ve tipli tut

```ts check
type Station = 'North' | 'South'

const readingKeys = {
  all: ['readings'] as const,
  station: (station: Station, page: number) =>
    ['readings', 'station', station, page] as const,
}

function readingKey(station: Station, page: number) {
  return readingKeys.station(station, page)
}
```

Factory’nin dönüştürdüğü tuple `as const` ile literal tuple tipini korur. Çağıran yerde key’i kurarken her defasında parçaları elle dizmek yerine isimli işlev kullanmak, `station` ile `page` sırasının tutarlı kalmasına yardım eder. Factory tek başına fetch başlatmaz ve cache’i doldurmaz; yalnızca kimlik üretir.

## Key ailesi nasıl büyür?

Küçük uygulamada `all`, `list`, `detail` dalları yeterli olabilir. Örneğin `['readings']` bütün gözlem cache’inin kökü; `['readings','station',station,page]` belirli sonuçtur. Bu hiyerarşi daha sonra bir aileyi invalidation ile yenilemek ya da cache’deki belirli girdiyle çalışmak için kullanışlıdır. Hemen şimdi mutation API’sini öğrenmen gerekmiyor; önemli olan aile düzeninin baştan okunabilir olmasıdır.

Birden fazla filtre varsa iki yol var. Her filtreyi ayrı parça olarak yazmak, key’e bakınca hiyerarşiyi görünür kılar: `['readings', 'station', station, page, sort]`. Filtre nesnesi kullanmak key’i daha kompakt tutar: `['readings', 'station', { station, page, sort }]`. Ekip genelinde bir yolu seç; aynı kaynağın key biçimini karıştırma.

:::mistake[Key’e bütün URL’yi koymak]
**Belirti:** Sadece paneldeki gereksiz bir `debug` parametresi değişince aynı GET yeniden başlar. → **Neden:** Sonucu etkilemeyen her URL parametresi key’e aktarılmıştır. → **Düzeltme:** Yalnız sunucu cevabını etkileyen parametreleri parse edip key’e ekle.
:::

:::mistake[Boşluk ve büyük/küçük harf]
**Belirti:** Kullanıcı `North` ve ` North ` için ayrı cache girdileri oluşturur. → **Neden:** Eşdeğer girdi tek bir biçime normalize edilmemiştir. → **Düzeltme:** API’nin anlamını değiştirmeden önce/sonra temizleme kararı ver ve key ile istekte aynı değeri kullan.
:::

:::mistake[Sayfayı unutmak]
**Belirti:** Sayfa 2’ye geçince sayfa 1 içeriği tekrar görünür. → **Neden:** `page` query function’a ulaşır ama key’de yoktur. → **Düzeltme:** `page` hem cache kimliğinde hem HTTP parametresinde aynı olsun.
:::

:::sector
Takımda key factory’lerini API modülünün yanında tutmak iyi bir sınırdır. Yeni bir filtre eklendiğinde geliştirici key’in hangi cevabı tanımladığını ve parametrenin hem key hem istek içinde yer alıp almadığını aynı yerde gözden geçirir.
:::

## Özet

- Key cache girdisinin kimliğidir; sonuç değişiyorsa key’de de değişiklik gerekir.
- Key ile istek parametreleri aynı normalize edilmiş değerleri kullanır.
- URL paylaşılabilir seçimi taşır; Query key o seçimin sunucu cevabına etkisini kaydeder.
- Key factory sıralamayı ve hiyerarşiyi tek yerde tutar; fetch yapmaz.
- Yalnız sonucu etkileyen, serileştirilebilir verileri key’e koy.

**Kendini yokla:** Sıralama ölçütü listeyi değiştiriyorsa key’in hangi bölümü değişmeli? Bir `queryFn` closure’ı yeni parametre okurken key sabit kalırsa cache neyi bilemez?

**Yanıt:** Sıralama ölçütü key’e eklenmeli. Key sabit kaldığında yeni cevabın farklı veri kimliğine ait olduğunu cache anlayamaz.
