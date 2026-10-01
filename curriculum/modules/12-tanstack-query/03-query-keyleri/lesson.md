---
title: "Query key ile doğru cevabı eşleştir"
minutes: 17
kind: concept
---

# Query key ile doğru cevabı eşleştir

Geçen derste `useQuery` ile Sinema’nın film listesini okudun. `queryKey` aynı kaldığı sürece Query aynı cache cevabına bakar. Şimdi URL’de tür seçimi değiştiğinde farklı filmleri farklı cache girdilerine nasıl bağlayacağını adım adım kuralım.

## Önce sabit bir listeyi adlandır

Bir istek tüm popüler filmleri getiriyorsa key’e önce kaynak adını koyabiliriz:

```ts
const queryKey = ['movies', 'popular']
```

Bu dizi, “filmler kaynağının popüler listesi” anlamına gelir. İki component aynı key ile `useQuery` çağırırsa aynı cache cevabını paylaşırlar. Key yalnızca okunaklı etiket değildir; Query bu kimliği kullanarak hangi cevabı bulacağını belirler.

Query, key dizisini **hash** eder; burada hash, key’i cache’in karşılaştırabileceği tutarlı bir kimliğe dönüştürme işlemidir. Array’deki sıra önemlidir: `['movies', 'popular']` ile `['popular', 'movies']` farklı key’lerdir. Plain object içindeki alanların yazım sırası ise sonucu değiştirmez; `{ genre: 18, page: 1 }` ile `{ page: 1, genre: 18 }` aynı değerleri tarif eder.

## Cevabı değiştiren seçimi key’e ekle

Şimdi kullanıcı bir tür seçebilsin. Tür değişince endpoint’in döndürdüğü liste de değişir, o yüzden seçilen `genreId` key’in parçası olmalı:

```tsx
const movies = useQuery({
  queryKey: ['movies', 'genre', genreId],
  queryFn: () => getMoviesByGenre(genreId),
})
```

`genreId` hem istekte hem key’de yer alıyor. Sinema’da tür değiştirince Query başka cache kimliğini seçer. Eğer key yalnız `['movies', 'genre']` olsaydı iki türün cevabı aynı kimliğe yazılır ve cache hangi listenin ekranda olması gerektiğini ayıramazdı.

Bunu şu soruyla kontrol et: “Bu cevabın değişmesine hangi kullanıcı seçimi neden olabilir?” Cevabı etkileyen her seçim key’de bulunmalı; sırf ekranda görünen ama isteği değiştirmeyen bir modal açık/kapalı durumu gibi değerler key’e girmez. Key ile query function aynı seçimi anlatmalıdır.

## Sayfa ve filtreyi birlikte taşı

Bir listeyi hem türe hem sıralama seçimine göre göstereceğimizi düşün. Filtre değerlerini bir plain object içinde tutabiliriz. **Normalize etmek**, aynı anlama gelen girdileri istekten önce tek bir biçime getirmektir; örneğin tür değerinin başındaki/sonundaki boşlukları temizlemek. Böylece kullanıcı `"Drama"` ve `" Drama "` yazdığında iki ayrı cache girdisi açılmaz.

```tsx
const filters = { genre: rawGenre.trim(), sort: selectedSort }

const movies = useQuery({
  queryKey: ['movies', 'catalog', filters],
  queryFn: () => getMovieCatalog(filters),
})
```

`filters` içindeki bir alan değişince yeni key oluşur. Plain object’te `genre` ile `sort` alanlarının hangi sırada yazıldığı önemli değildir; array’de `movies`, `catalog` ve filtre nesnesinin sırası ise önemlidir. Burada `page` gibi başka bir seçim listeyi değiştiriyorsa onu da filters’e eklemelisin. Aynı filtre değerlerini hem query function’a hem key’e vererek cache kimliği ile istek arasında tutarlılık sağlarsın.

![Query key parçalarının farklı cache girdilerine eşlenmesi](diagrams/query-key-cache.svg "Bir parametre değişince ayrı cache girdisi oluşur.")

## URL’den cache kimliğine iz sür

Kullanıcı Sinema katalog bağlantısını açsın: `/movies?year=2020&genre=drama`. `URLSearchParams` query string’deki değerleri okumaya yarar; okuduğun her değer metindir. Sayı gibi kullanılacak değeri `Number` ile sayıya çevirmek ve kabul edilebilir olup olmadığını doğrulamak gerekir.

```tsx
const params = new URLSearchParams(window.location.search)
const rawYear = params.get('year')
const year = Number(rawYear)
const genre = (params.get('genre') ?? '').trim()

const queryKey = ['movies', 'catalog', year, genre] as const
```

Bu örnekte key, normalize edilmiş türü ve yıla çevrilmiş değeri taşır. `as const`, TypeScript’e dizinin değişken uzunluklu sıradan dizi değil, öğeleri belli bir **tuple** olduğunu söyler; tuple, uzunluğu ve her konumdaki öğe türü bilinen dizidir. Key factory yazarken tuple tipi bu sırayı ve türleri korur.

`Number('abc')` sonucu `NaN` olur; boş veya geçersiz yılın istek ve cache kimliğine sızmasına izin verme. Örneğin 1900’den küçük bir yılı geçersiz sayacaksan kontrolü parse işleminden hemen sonra yap ve varsayılan bir yıla dön. Önemli olan, aynı düzeltilmiş değerle hem key’i hem query function’ı kurmandır.

Sayfa numarası için genelde pozitif tam sayı istersin. `Number.isInteger` tam sayı olup olmadığını, `> 0` ise sayının pozitifliğini kontrol eder:

```ts
const candidate = Number(params.get('page'))
const page = Number.isInteger(candidate) && candidate > 0 ? candidate : 1
```

`page=abc`, `page=0` ve `page=-2` böylece güvenli biçimde `1` olur. Kontrolü key’i kurmadan önce yaparsan hem cache hem istek aynı geçerli sayfa numarasını kullanır.

| Aşama | Değer | Ne yaptık? |
|---|---|---|
| URL | `?year=2020&genre=%20drama%20` | Kullanıcının seçimi bağlantıda |
| Okuma | `'2020'`, `' drama '` | URL değerleri string |
| Dönüştürme | `2020`, `'drama'` | Sayıyı parse ettik, metni temizledik |
| Key | `['movies', 'catalog', 2020, 'drama']` | Cache kimliği oluştu |
| İstek | `year=2020&genre=drama` | Aynı normalize edilmiş seçim gönderildi |
| Cevap | 2020 drama filmleri | Yalnız bu key’e kaydedildi |

Bir halka unutulursa sonuç şaşırtır: URL `year=2021` olur ama key hâlâ 2020’yi taşıyorsa cache yanlış cevabı seçebilir. Key yeni yılı taşıyıp istek 2020’yi yolluyorsa yanlış cevap yeni yılın kimliği altında saklanır. İki tarafta da aynı değeri kullan.

## Key ailesini tek yerde kur

Birden fazla component key üretmeye başladığında her yerde array parçalarını elle yazmak sıra hatasına yol açabilir. Bir **factory**, değer veya yapı üreten isimli fonksiyondur; burada key factory ortak key’leri tek bir yerde üretir:

```ts check title="src/movies/movieKeys.ts"
export const filmQueryKeys = {
  all: ['movies'] as const,
  genre: (genreId: number) => ['movies', 'genre', genreId] as const,
  catalog: (year: number, genre: string) =>
    ['movies', 'catalog', { year, genre }] as const,
}
```

Her key aynı `movies` ailesinden başlar. `genre` key’i tür id’sini, `catalog` key’i yıl ile türü taşır. Bu factory yalnızca kimlik üretir; isteği başlatmaz, veriyi çekmez. Bir key’i değiştirirken tek fonksiyonda düzenleme yaparsın ve bileşenler sırayı kendileri yeniden kurmaz.

## Gerçek bir yanlış ve düzeltmesi

Arama component’inde query function yeni metni görsün diye key’i sabit bırakmak cazip gelebilir:

```tsx
const movies = useQuery({
  queryKey: ['movies', 'search'],
  queryFn: () => searchMovies(searchText),
})
```

Belirti şudur: Matrix aramasından sonra Dövüş yazınca eski sonuç ekranda kalabilir veya iki farklı arama aynı cache kaydına gider. Query function `searchText` değerini okuyor olsa da key değişmediği için Query’ye yeni bir veri kimliği tanıtılmamıştır. Arama metni cevabı değiştiriyorsa key’e de ekle; aynı metin için aynı key’i üret.

:::mistake[URL’nin tamamını key’e taşımak]
**Belirti:** `debug=1` gibi cevabı etkilemeyen parametre değişince yeni istek başlar. → **Neden:** İlgisiz URL alanları da cache kimliğine eklenmiştir. → **Düzeltme:** Yalnız sunucu cevabını değiştiren ve normalize edilmiş değerleri key’e koy.
:::

:::mistake[Bir filtreyi istekte unutmak]
**Belirti:** Key farklı görünür ama iki key de aynı listeyi gösterir. → **Neden:** Filtre key’e eklenmiş, query function isteğine eklenmemiştir. → **Düzeltme:** Key ve istek aynı filtre değerlerini kullansın.
:::

## Özet

- Key, cache’teki cevabın kimliğidir; sonucu değiştiren her seçim kimliğe girer.
- Array sırası önemlidir; plain object içindeki alan sırası önemli değildir.
- URL değerleri string gelir; key ve istek için önce aynı biçime normalize et.
- Key factory, aile düzenini ve tuple sırasını tek yerde tutar; istek başlatmaz.
- Geçici UI değerleri ve cevabı etkilemeyen URL parametreleri key’e eklenmez.

**Yeni terimler:** hash — key’i cache kimliğine dönüştürme; normalize etmek — eşdeğer girdileri tek biçime getirmek; tuple — uzunluğu ve konum türleri belli dizi; key factory — query key üreten isimli fonksiyon.

**Kendini yokla:** URL’de tür değişince query function yeni türü alıyor ama key sabit kalıyorsa ne ters gidebilir? Array key’de sıra ile object alanlarının sırası aynı kurala mı uyar?

**Yanıt:** İki farklı tür aynı cache girdisini paylaşabilir, çünkü Query key’in değiştiğini görmez. Array sırası önemlidir; plain object’in alan sırası önemli değildir.
