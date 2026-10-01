---
title: "Büyük veri, az yönlendirme"
minutes: 14
kind: practice
---

# Büyük veri, az yönlendirme

Atölyede üç farklı belirtiyi çözümleyeceksin: liste yeniden sıralanınca seçimin kayması, tür değiştirince geç gelen yanıtın görünmesi ve URL'de saklanan iki seçimin birbirini bozması. Önce belirtiyi aynı kullanıcı adımlarıyla üret; sonra hangi bilginin değiştiğini bul. Tek düzeltme yapıp aynı adımları tekrar et.

:::model[Ağaç ve kimlik]
React state'i bileşenin ağaçtaki konumuna ve `key`'e bağlıdır. Listedeki sıra değişebilir; seçimi öğenin kalıcı kimliğiyle ilişkilendirirsen filtreleme ve sıralama sırasında başka öğeye taşınmaz.
:::

![Ağaç konumu ve key state kimliğini belirler](diagram:agac-ve-kimlik)

:::model[Render nedenleri]
Props, state veya tüketilen Context değişince ilgili bileşenler render olur. Memoization aynı girdideki işi atlayabilir; yanlış state veya yanlış kimlik modelini düzeltmez.
:::

![Render nedenlerini ve memo sınırlarını gösteren akış](diagram:render-nedenleri)

:::model[State kategorileri]
Bir kaynağın sahibi farklı olabilir: sunucu verisini TanStack Query, paylaşılabilir seçimi URL, yalnız ekrana ait geçici seçimi component state taşır. Veriyi getiren kodu ve liste görünümünü ayırınca her bölüm kendi sorumluluğunda kalır.
:::

:::model[Query önbellek yaşam döngüsü]
TanStack Query sonucu query key'e göre cache'ler; seçim değişince başka key'e bakarsın. Bir mutation ilgili veriyi değiştirdiyse o sorguyu invalidation ile bayat işaretle, böylece güncel sonuç yeniden alınabilir.
:::

## Liste sırası değişse de film aynı film

Sinema'da film gösterim sırası değişebilir. `key`, React'e her satırın hangi kayda ait olduğunu söyler:

```tsx check
type Movie = { id: number; title: string }

export function PremiereList({ movies }: { movies: Movie[] }) {
  return (
    <ul>
      {movies.map((movie) => <li key={movie.id}>{movie.title}</li>)}
    </ul>
  )
}
```

Sıralama değişince aynı `id` aynı filme işaret eder; sıra numarası ise başka filme karşılık gelebilir. Kalıcı kimlik, React'in satırları doğru öğeyle eşleştirmesine yardım eder. Eğer yerel seçim de satır state'inde tutuluyorsa kararlı `key` o state'in filme bağlı kalmasını sağlar.

## Her istek kendi seçimini tanısın

Şimdi oyuncu profillerinde bir arama düşün. **Query key**, TanStack Query'nin bir veriyi tanımak ve cache'te ayrı tutmak için kullandığı dizi kimliğidir. Sonucu değiştiren seçimi bu kimliğe eklersin:

```ts check
const firstActorKey = ['actor-filmography', 12]
const secondActorKey = ['actor-filmography', 27]
// İki farklı oyuncu için iki farklı cache kimliği.
```

İlk istek yavaş, ikinci hızlı dönse bile her cevap kendi oyuncu kimliğine aittir. Sabit tek bir key kullanırsan iki seçimin sonucunun hangisi olduğunu ayırt edemezsin.

| Adım | Seçim / cevap | Ekranın baktığı key | Görünen sonuç |
|---|---|---|---|
| 1 | Oyuncu 12 isteği başlar | `['actor-filmography', 12]` | Önceki sonuç veya yükleniyor |
| 2 | Oyuncu 27 seçilir, isteği hızlı döner | `['actor-filmography', 27]` | Oyuncu 27'nin filmleri |
| 3 | Oyuncu 12'nin yanıtı geç gelir | Hâlâ `['actor-filmography', 27]` | Oyuncu 27'nin filmleri kalır |

Yanıtların geliş sırası değişebilir; seçili sorgunun kimliği değişmez. Her seçimin key'i farklıysa geç yanıt başka seçimin görünümünü ele geçirmez.

## URL'deki seçimleri bağımsız tut

Bir izleme panosunda kullanıcı hem sıralama yönünü hem de yayın dönemini seçsin. **URL state**, paylaşılabilen veya yenilemede korunması istenen seçimin URL'de tutulmasıdır. İki parametreyi ayrı okumak, birini değiştirirken diğerini korumayı sağlar:

```ts check
const params = new URLSearchParams('?sort=recent&period=classic')
const sort = params.get('sort') ?? 'recent'
const period = params.get('period') ?? 'all'
params.set('period', 'classic')
// sort=recent seçimi de URL'de kalır.
```

Her filtre kendi sorusunu yanıtlar: sıralama hangi düzende, dönem hangi filmler? Birini değiştirince ötekini sıfırlamazsın. Uygulamada URL'yi tek kaynak olarak kullanırsan yenileme ve bağlantıyı paylaşma aynı seçimleri geri getirir.

## Atölye akışını kur

Query, URL ve görünüm farklı sorumlulukları taşır. Bir proje kurarken önce kullanıcı seçimini ve filtreyi belirle; sonra veriyi getirme kodunu liste görünümünden ayır. Büyük filtreli listede inputun anında yanıt vermesi gerekiyorsa liste güncellemesini `useDeferredValue` ile düşük öncelikte tutabilirsin.

Yavaş isteklerde seçimin kimliğini query key'e kat. Bir mutation (sunucudaki veriyi değiştiren istek) başarılı olduktan sonra etkilenen sorguyu yenile; listeyi kendin elle eşitlemek yerine TanStack Query'nin invalidation (cache verisini bayat işaretleyip yeniden sorgulatma) aracını kullanabilirsin. Her akışta yükleniyor, hata ve boş sonuç durumlarını ayrı düşün: boş sonuç hata değildir.

:::mistake[Seçim başka kayda geçiyor]
Arama veya sıralamadan sonra işaret başka filme taşınırsa, state ya da satır `key`'i listedeki konuma bağlıdır. Kalıcı film kimliğini kullan; liste sırası kimlik değildir.
:::

:::mistake[Eski cevap yeni seçimi eziyor]
Tür veya filtre değiştirdikten sonra eski sonuç görünürse, farklı seçimler aynı query key'i paylaşıyor olabilir. Sonucu değiştiren parametreyi query key'e ekle ki her seçim kendi cache kaydını kullansın.
:::

:::mistake[Boş ekranı hata sanmak]
İstek başarılı olup eşleşme bulamadıysa hata mesajı gösterme. Yükleme, hata ve başarıyla gelen boş liste farklı durumlardır; her biri için anlaşılır bir görünüm seç.
:::

## Özet

- Liste indeksi değişebilir; öğenin `id`'si kalıcı kimliktir.
- Sonucu etkileyen her seçim Query key'de yer almalıdır.
- URL'ye yazılan bağımsız seçimler yenileme ve paylaşımda korunur.
- Veri getirme ile görünüm sorumluluğunu ayır; yükleniyor, hata ve boş durumları ayrı ele al.
- Bir belirtide tek değişkeni düzeltip aynı akışı yeniden dene.

**Terimler**

- **Query key:** TanStack Query cache'inde bir sorguyu tanımlayan dizi.
- **URL state:** URL'de saklanan, paylaşılabilen veya yenilemede korunabilen arayüz seçimi.
- **Mutation:** Sunucudaki veriyi değiştiren istek.
- **Invalidation:** Cache kaydını bayat işaretleyip gerektiğinde yeniden sorgulatma.

**Kendini yokla**

1. Bir filtre değişince query key'e neden o filtreyi de eklersin? **Cevap:** Her seçimin sonucu ayrı tanınsın; geç gelen cevap başka seçimin verisiyle karışmasın.
2. Boş sonuçla hata arasındaki fark nedir? **Cevap:** Boş sonuç başarılı istekte eşleşme bulunmamasıdır; hata ise verinin alınamaması veya işlenememesidir.
