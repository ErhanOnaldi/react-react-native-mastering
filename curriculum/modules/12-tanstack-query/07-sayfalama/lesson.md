---
title: "Sayfa değişirken önceki sonucu koru"
minutes: 15
kind: concept
---

# Sayfa değişirken önceki sonucu koru

:::pain[Problem]
Kültür merkezinin etkinlik listesindeki “Sonraki” düğmesine basınca tüm kartlar kayboluyor. Bir saniye sonra yeni sayfa geliyor; kullanıcı önce hangi sayfada olduğunu, sonra yeni sonuçların yüklenip yüklenmediğini anlamaya çalışıyor.
:::

## Yeni sayfa yeni cache kimliğidir

Sayfalı liste bir defada bütün kayıtları getirmek yerine veriyi dilimler. Sayfa numarası cevabı değiştiriyorsa query key’in de parçası olmalıdır. `page=1` ve `page=2` farklı cache girdileridir; ikinci sayfa isteği devam ederken birinci sayfanın sonucu yanlışlıkla yeni key’in kalıcı verisi sayılmamalıdır.

:::model[Query key]
Key, sonuç için kullanılan bütün girdileri taşır. Sayfa numarası değişince yeni kimliğe geçiyoruz; böylece page 1 ve page 2 cache’te karışmaz. Eklenen yeni davranış yalnızca geçiş aralığında önceki sonucu placeholder olarak göstermek.
:::

![Sayfa key'i değişince eski verinin geçici gösterilip yeni cevapla değişmesini anlatan diyagram](diagrams/sayfa-placeholder.svg "Eski sayfa yalnızca geçiş sırasında yer tutar.")

React Router’da `page` URL’deyse aynı sayı query key ve request URL’ine gider. URL geri tuşu ve paylaşımı korur; cache’in kimliği de hangi sayfanın cevabını okuyacağını bilir. URL parametresini `Number` ile sayıya dönüştürmek yetmez: `NaN`, sıfır, negatif ve ondalık değerleri de kontrol et. Geçersiz değeri 1’e düzeltmek, API’ye anlamsız sayfa göndermeyi önler.

TanStack Query 5’te `placeholderData: keepPreviousData`, key değişiminden sonra önceki query verisini yeni query’nin cevabı gelene kadar gösterir. Buradaki “önceki” veri yeni cache key’inin içine kopyalanmaz; yalnızca component’in geçiş sırasında okuyabildiği placeholder’dır. `isPlaceholderData` bu farkı arayüzde anlatmak için vardır.

Placeholder modelinin kuralları:

1. Farklı sayfalar farklı key kullanır; önceki sonuç kendi sayfa key’inde kalır.
2. Yeni key için istek başlar; eski data yalnız bu geçiş boyunca gösterilir.
3. `isPlaceholderData` true iken görünür data ile hedef sayfa aynı olmayabilir.
4. Yeni cevap geldiğinde observer’ın `data` değeri hedef key’in cevabına geçer.
5. `staleTime` ve `gcTime` cache’in freshness ve bellek ömrünü yönetir; placeholder üretmez.

## Sayfa geçişini zamanıyla izle

Page 1 cache’te hazır olsun. Kullanıcı sonraki sayfaya basınca URL `?page=2` olur, render yeni key ile query’ye abone olur ve page 2 isteği başlar. Page 1 verisi placeholder olarak görünmeye devam eder. Yeni cevap geldiğinde Query page 2’nin kendi cache girdisini doldurur ve placeholder durumu biter.

| Zaman | URL / key | Gösterilen data | Durum ve kontrol |
|---|---|---|---|
| Önce | `page=1` | Sayfa 1 | Normal success |
| Tıklama | `page=2` | Sayfa 1 geçici | `isPlaceholderData` true olabilir |
| İstek sürüyor | Page 2 key’i | Sayfa 1 geçici | Kullanıcı geçişte olduğunu görür |
| Cevap geldi | Page 2 key’i | Sayfa 2 | Placeholder kapanır |
| Geri tuşu | Page 1 key’i | Page 1 cache’i varsa onu oku | Eski cache politikası uygulanır |

Bu sırada `data` dolu olabilir; `isPending` zorunlu olarak true olmaz. Tam ekran loading branch’ine geçmek eski içeriği siler. Daha küçük “yeni sayfa yükleniyor” etiketi veya düğme yakınındaki spinner geçişi belirtir. Ayrıca eski data’yı yeni sayfaya aitmiş gibi etiketlememek gerekir. Örneğin “Sayfa 2” yazısını URL’den alırken kartların page 1’den geldiğini belirtmek kullanıcıya doğru bilgiyi verir.

### Kırık örnek: `page` key’de yok

```ts
const pageQuery = useQuery({
  queryKey: ['events'],
  queryFn: () => getEvents(page),
})
```

URL’den page 2’ye geçildiğinde key değişmez. Query’nin yeni girdiye geçmesi ve placeholder davranışını hesaplaması için gereken kimlik bilgisi yoktur. Sonuçta eski data aynı cache girdisine rakip olabilir.

### Doğru yapı: key, istek ve placeholder birlikte

```tsx check
import { keepPreviousData, useQuery } from '@tanstack/react-query'

type EventPage = { page: number; results: { id: number; title: string }[] }
declare function getEvents(page: number): Promise<EventPage>

function EventList({ page }: { page: number }) {
  const events = useQuery({
    queryKey: ['events', page],
    queryFn: () => getEvents(page),
    placeholderData: keepPreviousData,
  })

  if (events.isPending) return <p>Etkinlikler yükleniyor</p>
  if (events.isError) return <p role="alert">Etkinlikler alınamadı</p>
  return (
    <section aria-busy={events.isFetching}>
      {events.isPlaceholderData && <p>Yeni sayfa yükleniyor</p>}
      <ul>{events.data.results.map((event) => <li key={event.id}>{event.title}</li>)}</ul>
    </section>
  )
}
```

Buradaki `page` props’u önceden doğrulanmış bir sayıdır. Gerçek ekranda URL parse işlemi component veya route sınırında yapılır; fetch function geçersiz sayıyla karşılaşmamalıdır. `aria-busy` bölgenin güncellenmekte olduğunu yardımcı teknolojiye de aktarır.

## İleri ve geri sayfa kararları

Placeholder, kullanıcıya geçişte bir şey göstermek içindir; pagination API’sini ortadan kaldırmaz. “Önceki” ve “Sonraki” düğmelerinin disabled durumu, hangi sayfada olduğun ve toplam sayfa sayın gibi ürün bilgileriyle yönetilir. Son sayfada ileri gidilmez; ilk sayfada geri gidilmez. Kullanıcı hızlıca iki kez basarsa birden çok geçiş aynı anda başlayabilir; düğmeyi istek sırasında kilitlemek veya en son URL state’ini esas almak gerekir.

Filtre değişince çoğu listede page 1’e dönmek beklenir. Örneğin kullanıcı kategori A’nın page 5’indeyken kategori B’yi seçerse B’de page 5 boş olabilir. Filtre de key’e girmelidir: `['events', category, page]`. URL’de filtre değiştirirken page’i 1’e çekmek, görünür adres ile sorgu girdisini tutarlı tutar.

Arayüzde ileri eylemi hedef data henüz gelmeden tekrar kullanılabilir olmamalı. Örneğin page 1’in cevabında `hasMore=false` ise “Sonraki” kapalıdır; kullanıcı page 2’ye geçmiş ama page 1 hâlâ placeholder olarak görünüyorsa eski cevabın `hasMore` değerini yeni sayfanın gerçeğiymiş gibi kullanma. `isPlaceholderData` durumunda ileri kontrolünü bekletmek güvenlidir. Benzer biçimde sayfa göstergesi URL’den “2” derken eski kartları gösteriyorsa geçiş mesajı o anda özellikle önemlidir.

Tarayıcının geri/ileri gezinmesi de aynı modelden yararlanır. URL page 1’e döner, observer page 1 key’ini izler. Cache’de data ve fresh süre varsa hemen gösterilir; süre geçtiyse eski data görünürken yenileme olabilir; girdi GC edilmişse ilk açılış gibi pending görünür. Bu yüzden “geri tuşu her zaman anında” garantisi verilemez; `staleTime` ve `gcTime` ürün davranışını etkiler.

`placeholderData` cache ömrü değildir. `gcTime`’ı düşürerek geçişte boşluğu çözmeye çalışma; cache’i erken silmek geri dönüşleri daha da yavaşlatabilir. `staleTime` de placeholder süresini belirlemez; o, verinin ne kadar süre fresh sayılacağıyla ilgilidir.

## Sınır durumları ve sık hatalar

:::mistake[Eski sayfayı güncelmiş gibi etiketlemek]
**Belirti:** Başlık “Page 2” derken içerik hâlâ page 1’dir. → **Neden:** Placeholder sırasında data’nın kaynağı işaretlenmemiştir. → **Düzeltme:** `isPlaceholderData` ile geçiş metni göster; page 2’ye özel eylemleri yeni data gelene kadar kapat.
:::

:::mistake[Eski API biçimini kullanmak]
**Belirti:** TypeScript `keepPreviousData` seçeneğini kabul etmez. → **Neden:** TanStack Query v5’te eski `keepPreviousData: true` alanı kaldırılmıştır. → **Düzeltme:** `placeholderData: keepPreviousData` function’ını import edip geçir.
:::

:::mistake[Geçersiz sayfayı sunucuya yollamak]
**Belirti:** `page=NaN` veya `page=-1` için 400 yanıtı gelir. → **Neden:** URL string’i güvenli tamsayıya dönüştürülmemiştir. → **Düzeltme:** Pozitif tam sayı kontrolü yap; geçersizse anlamlı varsayılan seç.
:::

:::mistake[Placeholder’ı cache kopyası sanmak]
**Belirti:** Page 2’ye dönünce page 1 satırlarının orada kalıcı olduğunu varsayarsın. → **Neden:** Eski data geçiş için gösterilir; yeni key’in kendi cache girdisi değildir. → **Düzeltme:** Yeni cevap geldiğinde içerik değişeceğini, geri dönüşte ise page 2’nin kendi cache/stale politikasının çalışacağını tasarla.
:::

:::sector
Liste arayüzlerinde ekipler URL, key ve request parametresinin aynı sayfayı gösterdiğine dikkat eder. Geçiş süresince tutulan içeriği görsel ya da erişilebilir bir metinle açıklamak, “yanlış sayfa gösteriyor” hissini azaltır.
:::

## Özet

- Her sayfa farklı cevapsa page numarası key’in parçasıdır.
- Query v5’te `placeholderData: keepPreviousData`, yeni cevap gelene kadar eski sonucu geçici gösterir.
- `isPlaceholderData` geçiş anını ayırt eder; eski data yeni key’e kopyalanmaz.
- URL, key ve HTTP isteği aynı filtre/sayfa değerlerini kullanır.
- Placeholder tazelik ya da cache saklama süresi değildir.

**Kendini yokla:** Page 2 yüklenirken eski içerik hangi key’in kalıcı verisidir? Filtre değiştiğinde neden page 1’e dönmek gerekebilir?

**Yanıt:** Eski içerik page 1 key’inin verisidir ve page 2 için geçici placeholder olarak görünür. Yeni filtrenin page 5’i boş olabilir; page 1’e dönmek geçerli sonuçları gösterir.
