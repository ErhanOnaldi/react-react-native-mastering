---
title: "Sonsuz listede sayfaları biriktir"
minutes: 15
kind: concept
---

# Sonsuz listede sayfaları biriktir

:::pain[Problem]
Doğa rotaları sayfasında “Daha fazla”ya basınca önceki yürüyüşler kaybolup yalnızca yeni 20 kayıt görünüyor. Bu ekranda sayfa 2, sayfa 1’in yerine geçmemeli; ikisi de aynı akışta kalmalı.
:::

## Sayfa değiştirmek ile sayfa eklemek farklı davranıştır

Klasik pagination’da `page` değişir ve ekran yeni dilimi gösterir. Sonsuz listede ise kullanıcı bir sonraki parçayı ister; eski parçalar da görünür kalır. API yine sayfalı cevap döndürebilir, ancak arayüzün ihtiyaç duyduğu veri modeli bir sayfa nesnesi yerine birden fazla sayfanın zinciridir.

:::model[Query key]
Key cevabın kimliğidir. Sonsuz sorgunun key’i arama, kategori veya kullanıcı gibi listenin bütün akışını tanımlayan filtreleri tutar; tek tek sayfa parametreleri bu key’e eklenerek bağımsız query yapılmaz. Bu derste aynı query girdisinde birden fazla sayfa parametresini topluyoruz.
:::

TanStack Query `useInfiniteQuery` için `initialPageParam`, `queryFn`, `getNextPageParam` ve `queryKey` istenir. Başlangıç parametresi ilk sayfayı söyler. Query function her fetch’te kendisine verilen `pageParam` ile o sayfanın verisini alır. `getNextPageParam` son cevabı ve sayfaların bağlamını inceleyerek sonraki parametreyi döndürür. Artık sayfa yoksa `undefined` döndürülür; böylece `hasNextPage` false olur.

![Sonsuz sorguda her sayfanın aynı query verisine eklenmesini gösteren akış](diagrams/infinite-pages.svg "Yeni pageParam ile gelen data, önceki sayfaların yanına eklenir.")

`data.pages` cevapların sıralı dizisidir; `data.pageParams` her cevap için hangi parametrenin kullanıldığını taşır. UI çoğu zaman sayfa içindeki satırları `flatMap` ile tek listede gösterir. Query sayfaları cache içinde birlikte yönetir; tek tek parçaları ayrıca local state’e eklemene gerek kalmaz.

Sonsuz sorgu modelinin kesin kuralları:

1. Bir akış, key ile birlikte filtre ve kaynak kimliğini sabit tutar.
2. `initialPageParam` ilk isteğin parametresini belirler.
3. `queryFn` her çağrıda kendisine gelen `pageParam`’ı kullanır.
4. `getNextPageParam` bir sonraki geçerli parametreyi veya devam yoksa `undefined` döndürür.
5. `data.pages[i]` ile `data.pageParams[i]` aynı sıradaki cevap ve isteği anlatır.

Bir normal query’de sayfa numarasını key’e koymak gerekir; infinite query’de page parametreleri aynı akışın içindeki ayrı parçalardır. Bu iki şekli ayır: infinite query’nin key’i `['places','popular']` olurken sayfa 1 ve 2 `pageParams` altında durur. Eğer arama ifadesi değişirse akışın kendisi değiştiği için arama kelimesi key’e eklenir. Infinite query’yi klasik sayfalama gibi key’de `page` ile değiştirmek, her sayfayı ayrı tek parça data’ya dönüştürür ve “biriktirme” davranışını kaybettirir.

## Son cevaptan sonraki parametreye kadar iz sür

İlk çağrıda `initialPageParam: 1` olur. Query function `pageParam=1` ile API’den ilk sayfayı ister; cevap `{page: 1, total_pages: 3, results: [...]}` döner. Query sayfayı `data.pages[0]`, kullanılan 1’i `data.pageParams[0]` içine koyar. `getNextPageParam` 1 < 3 olduğunu görür ve 2 döndürür. Kullanıcı devam eylemine basınca query function bu kez 2 ile çalışır. Üçüncü sayfadan sonra 3 < 3 false olur ve `undefined` döner.

| Olay | `pageParam` | Son cevap | Sonraki parametre | Liste |
|---|---:|---|---:|---|
| İlk açılış | 1 | page 1 / toplam 3 | 2 | Sayfa 1 |
| İlk devam | 2 | page 2 / toplam 3 | 3 | Sayfa 1 + 2 |
| İkinci devam | 3 | page 3 / toplam 3 | `undefined` | Sayfa 1 + 2 + 3 |
| Son durum | — | — | `hasNextPage === false` | Devam düğmesi kapanır |

Bu modelde filtre değişirse yeni bir liste oluşur, dolayısıyla filtre key’in içinde olmalıdır. Aynı query key üzerinde yeni bir arama başlatmak eski sayfaların başka filtreye aitmiş gibi görünmesine neden olur. Filtre değiştiğinde ilk page parametresi de yeniden 1 olmalıdır.

### Bozuk örnek: yeni sayfayı sonuç dizisinin yerine koy

```tsx
const [rows, setRows] = useState<Place[]>([])

async function loadNext() {
  const next = await getPlaces(page + 1)
  setRows(next.results)
}
```

`setRows(next.results)` önceki kayıtları atar. `setRows(current => [...current, ...next.results])` ile yamamak da başka risk açar: duplicate istek veya filtre değişiminde eski listeyi temizlemeyi kendin yönetirsin. Cache ile local state iki ayrı liste sahibi hâline gelir.

### Query’nin sayfa zinciri

```ts check
import { useInfiniteQuery } from '@tanstack/react-query'

type PlacePage = { page: number; total_pages: number; results: { id: number; name: string }[] }
declare function getPlaces(page: number): Promise<PlacePage>

function usePlaces() {
  return useInfiniteQuery({
    queryKey: ['places', 'popular'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getPlaces(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  })
}
```

Ekran `query.data?.pages.flatMap(page => page.results)` ile kayıtları birleştirebilir. İlk istekte `isPending`, sonraki sayfa isteğinde `isFetchingNextPage` okunur. `isFetching` tüm query fetch’lerini kapsayabilir; düğmenin metnini sonraki sayfa özelinde değiştirmek için `isFetchingNextPage` daha açıklayıcıdır.

## Liste uzadıkça sınırları düşün

Sonsuz liste büyüdükçe bellek artar, DOM elemanları çoğalır ve kullanıcının listeyi taraması zorlaşır. Büyük uygulamalar görünür olmayan satırları sanal listeyle DOM’dan çıkarabilir; bu Query’nin sayfa cache’ini otomatik küçültmez. `maxPages` cache’te tutulacak sayfa sayısını sınırlar. İleri ve geri gezinmeyi destekleyeceksen `getPreviousPageParam` da tanımla; sayfalar düşürüldüğünde kullanıcının yönünü koruyacak davranışa ihtiyacın var.

Sadece ileri doğru “daha fazla göster” akışında da maksimumu sınırlamak, eski sayfaların cache’ten çıkarılmasına yol açabilir. Bu ürün kararı görünümün beklentisiyle uyumlu olmalı. Bir e-ticaret listesi “önceki ürünlere dön” olanağı vermiyorsa eski sayfaları silmek kabul edilebilir; sohbet geçmişinde yukarı kaydırarak eskilere dönmek gerekiyorsa geri sayfayı da tasarlamalısın.

Kullanıcı “Daha fazla”ya hızlıca iki kez basarsa aynı anda birden fazla next-page fetch başlatmaya çalışabilir. `isFetchingNextPage` true iken düğmeyi devre dışı bırak ve erişilebilir durum metni göster. Query’nin hasNextPage false olduğu durumda da düğme görünmemeli. Hata oluşursa bütün ilk sayfayı silmek yerine devam isteğini ayrı anlat; kullanıcı tekrar deneyebilsin.

Sayfa içeriğinin sırası da cache davranışının parçasıdır. API cevapları kronolojikse `pages` sırası kullanıcı akışını korur; `flatMap` ile ters çevirmek ürün kararıdır, teknik zorunluluk değil. Sayfa içi sonuçlar boş olabileceğinden “boş” ile “devam yok”u karıştırma: boş page’e rağmen API `total_pages` daha büyük diyorsa sonraki page hâlâ olabilir. Backend sözleşmesi izin veriyorsa boş sayfaya göre bitiş kararı verme; `total_pages`, `nextCursor` veya `hasMore` alanını esas al.

Sonsuz listeyi test ederken ekranda bir önceki kartın kalması ve page parametresinin artması davranışın kanıtıdır. Üretimde ise ölçümde aynı query key altında sayfaların büyümesini, `maxPages` sonrasında düşen sayfaların kullanıcı deneyimine etkisini gözle. Query cache’in tuttuğu sayfa sayısını sınırlamak ile DOM’da görünmeyen kartları sanallaştırmak iki ayrı optimizasyondur.

## Sınır durumları ve sık hatalar

:::mistake[Son sayfa kontrolü yok]
**Belirti:** Ağ panelinde aynı son sayfanın istekleri tekrarlanır veya `page=total_pages+1` gider. → **Neden:** `getNextPageParam` her zaman `page + 1` döndürür. → **Düzeltme:** Son sayfada `undefined` dön; UI’da `hasNextPage` ile devam eylemini kapat.
:::

:::mistake[Yanlış türde query seçmek]
**Belirti:** Yeni sayfada önceki kartların hepsi kaybolur. → **Neden:** Tek sayfalı query’deki sayfa parametresi değiştiriliyordur. → **Düzeltme:** Biriktirilen liste için `useInfiniteQuery`, yerine geçen pagination için `useQuery` kullan.
:::

:::mistake[Sonraki sayfa isteğini kilitlememek]
**Belirti:** Bir kart listesi sayfa 2’de yinelenir. → **Neden:** Yükleme sırasında hızlı birden fazla tıklama vardır. → **Düzeltme:** `isFetchingNextPage` ile düğmeyi geçici devre dışı bırak; yanıt gelince yeniden aç.
:::

:::mistake[Parametreyi URL’ye taşımak]
**Belirti:** `useInfiniteQuery` ilk sayfada kalır ya da sonraki çağrı aynı page’i ister. → **Neden:** Query function gelen `pageParam` yerine sabit 1 kullanır. → **Düzeltme:** Her istekte `pageParam`’ı API fonksiyonuna aktar.
:::

:::sector
Akış tasarlarken API’nin `hasMore`, `nextCursor` veya toplam sayfa gibi hangi sinyali sağladığını belirle. Sonraki parametreyi bu sözleşmeden üret ve son sayfada isteği kapat. Cursor tabanlı endpoint’te sayıyı artırmak yerine cevaptan dönen cursor’ı kullan.
:::

## Özet

- Sonsuz listede sayfalar birikir; klasik pagination’da bir sayfa diğerinin yerini alır.
- `useInfiniteQuery` sayfaları `data.pages` içinde, parametrelerini `data.pageParams` içinde tutar.
- `initialPageParam` ilk değerdir; `getNextPageParam` son sayfada `undefined` döndürür.
- Sonraki fetch durumu `isFetchingNextPage`, devam imkânı `hasNextPage` ile okunur.
- Liste büyümesini, tekrar tıklamayı ve sayfa sınırlarını planla.

**Kendini yokla:** `getNextPageParam` neden son sayfada `undefined` döndürür? `maxPages` eklemek neden geri gezinme tasarımını etkiler?

**Yanıt:** `undefined` artık devam parametresi olmadığını bildirip `hasNextPage` değerini kapatır. Sayfa sınırına ulaşıldığında eski data düşebilir; geriye dönme gereksinimi ayrıca ele alınmalıdır.
