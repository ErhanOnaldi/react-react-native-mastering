---
title: "Yazmayı önceliklendir"
minutes: 15
kind: concept
---

# Yazmayı önceliklendir

Sinema’da arama kutusuna film adı yazarken, inputtaki harf hemen görünmeli. Sonuç listesi ise yüzlerce filmi süzüp ekrana basacağı için daha fazla iş yapabilir. İki işi de aynı state değişikliğiyle aynı anda başlatırsan, liste ağır olduğunda yazmak takılabilir.

## Önce input ve listeyi ayıralım

**Controlled input**, ekranda görünen değeri React state’inden alan input’tur. En basit hâlinde her tuşta state güncellenir ve yeni harf hemen görünür:

```tsx
const [query, setQuery] = useState('')

return (
  <input
    value={query}
    onChange={(event) => setQuery(event.target.value)}
  />
)
```

Bu ilk örnekte input güncel `query` değerini gösterir. Henüz ağır bir iş yok; kullanıcı yazdıkça state ve kutu birlikte değişir. Bu doğrudan kullanıcı etkileşimine bağlı güncellemeye **acil güncelleme** diyebiliriz.

Şimdi aynı sorguyla film listesini de filtreleyelim:

```tsx
const [query, setQuery] = useState('')
const visibleMovies = movies.filter((movie) =>
  movie.title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')),
)

return (
  <>
    <input value={query} onChange={(event) => setQuery(event.target.value)} />
    <MovieList movies={visibleMovies} />
  </>
)
```

`setQuery` hem inputu hem filtre hesabını etkiliyor. Küçük bir listede bunu fark etmeyebilirsin. Büyük veya pahalı bir listeyi hazırlamak ana iş parçacığında zaman alır. **Ana iş parçacığı**, tarayıcının JavaScript ve arayüz işleri için kullandığı hat; uzun bir iş sürerken yeni tuş olayı da bekleyebilir.

## Listeye sorgunun ertelenmiş hâlini ver

React `useDeferredValue` ile state’teki değerin güncel olmayabilecek, ertelenmiş bir kopyasını verir. Bu Hook ağır işi yapan alt bölüme bağlanabilir; input ise hâlâ anlık state’i kullanır.

```tsx
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)

const visibleMovies = movies.filter((movie) =>
  movie.title.toLocaleLowerCase('tr').includes(deferredQuery.toLocaleLowerCase('tr')),
)

return (
  <>
    <input value={query} onChange={(event) => setQuery(event.target.value)} />
    <MovieList movies={visibleMovies} />
  </>
)
```

Şimdi yazı kutusu `query` ile hemen güncellenir; ağır listenin filtresi `deferredQuery` ile yürür. React önce acil güncellemeyi gösterebilir, sonra listeyi yeni sorguyla hazırlayabilir. Bu Hook belli bir süre bekletmez ve ağ isteklerini azaltmaz; yapılacak arayüz işinin önceliğini düzenler.

Sıralamayı somut görelim. Kullanıcı önce `A`, hemen ardından `B` yazsın:

| An | `query` (input) | `deferredQuery` (liste) | Ekrandaki durum |
|---|---|---|---|
| İlk açılış | `""` | `""` | Tüm filmler görünür |
| `A` yazdı | `"A"` | henüz `""` olabilir | Kutuda `A`; liste eski sorgudaki sonuçları kısa süre koruyabilir |
| Hemen `B` yazdı | `"AB"` | hâlâ `""` olabilir | Kutuda `AB`; React önceki liste işini bırakıp son sorguya yönelebilir |
| Liste güncellendi | `"AB"` | `"AB"` | Liste `AB` ile süzülür; bekleme bilgisi kalkar |

Arka planda hazırlanan render, yeni acil bir etkileşim geldiğinde durdurulabilir ve güncel state ile yeniden denenebilir. Bu yüzden ekrandaki sıra “her harfi filtrele, hepsini sırayla bitir” olmak zorunda değildir. Kullanıcıya gösterdiğin sonuç yine en son sorguya ait olur.

## Liste beklerken bunu göster

`query !== deferredQuery` olduğunda input yeni değeri almıştır ama liste henüz o değere yetişmemiş olabilir. Bu farkı küçük bir mesajla gösterebilirsin:

```tsx
{query !== deferredQuery && <p>Liste güncelleniyor</p>}
```

Kısa bir güncellemede mesaj göz kırpıp kaybolabilir; hiç görünmemesi de sorun değildir. Asıl amaç input değerini geciktirmeden, listenin geçici olarak eski sorguda olduğunu dürüstçe belirtmektir.

:::mistake[Inputun kendisini ertelemek]
- **Belirti:** Yazdığın harf kutuda gecikmeli görünür veya yazarken önceki harf geri gelir.
- **Neden:** Inputun `value` değerini `deferredQuery` yaptın; böylece kullanıcıya hemen göstermesi gereken işi de erteledin.
- **Düzeltme:** Input `value={query}` ile güncel state’i kullansın. `deferredQuery` yalnız ağır sonuç listesine gitsin.
:::

## Sekme değişimini geçiş olarak işaretle

Arama değerinde `useDeferredValue` kullanmak işe yarar; ama bazen değiştirmek istediğin state doğrudan senin kontrolündedir. Örneğin Sinema’da “Özet” ve “Oyuncular” sekmeleri arasında geçiş yaparken yeni panelin çizilmesi ağır olabilir. **Transition**, React’e bu state değişikliğinin acil kullanıcı geri bildiriminden sonra yapılabileceğini söyleyen düşük öncelikli güncellemedir.

`useTransition` sana `startTransition` fonksiyonunu ve `isPending` değerini verir. Fonksiyon içinde sekme state’ini güncelle; React geçiş sürerken `isPending` değerini `true` yapabilir.

```tsx
const [tab, setTab] = useState<'overview' | 'cast'>('overview')
const [isPending, startTransition] = useTransition()

function selectTab(nextTab: 'overview' | 'cast') {
  startTransition(() => {
    setTab(nextTab)
  })
}
```

Butona basıldığında React önce tıklamaya ve input gibi acil etkileşimlere yanıt verir; sonra yeni paneli hazırlamaya devam eder. `isPending` geçiş tamamlanmadığını belirtir, ama bu bir milisaniye sayacı değildir.

```tsx
<button onClick={() => selectTab('overview')}>Özet</button>
<button onClick={() => selectTab('cast')}>Oyuncular</button>
<p role="status">{isPending ? 'Sekme açılıyor' : ''}</p>
{tab === 'overview' ? <p>Film özeti</p> : <p>Oyuncu listesi</p>}
```

`role="status"`, yardımcı teknolojiye değişen durum mesajını duyurması için işaretlenmiş alandır. Alanı sürekli DOM’da tutup metni boşaltmak, bekleme durumunun başlayıp bitmesini anlaşılır kılar.

## Hangi aracı seçmelisin?

`useDeferredValue`, bir değeri alan ağır bölüm senin kontrolünde değilse ya da inputun anlık kalıp listenin ertelenmesini istiyorsan uygundur. `useTransition`, state güncellemesini sen başlatıyorsan onu düşük öncelikli olarak işaretlemek ve geçiş durumunu izlemek için kullanılır. Bir ekranda ikisini birlikte kullanmak mümkün olsa da her zaman gerekli değildir.

İkisi de **debounce** değildir. Debounce, örneğin kullanıcı 300 ms yazmayı bırakana kadar bir işi bekleten zaman temelli tekniktir. Deferred değer ve transition sabit süre beklemez; React işi cihazın durumuna göre erteleyebilir. Bunlar ağ isteklerini de azaltmaz. Her harfte API çağırmamak istiyorsan istek politikasını ayrıca debounce ile kurarsın.

:::mistake[Input state’ini transition içine almak]
- **Belirti:** Input güncellemesi düşük öncelikli olur ve yazma hissi ağırlaşır.
- **Neden:** Kullanıcının yazdığı harfin kutuda görünmesi ertelenebilir iş değildir.
- **Düzeltme:** `setQuery` çağrısını doğrudan `onChange` içinde yap. Ağır türetilmiş listeyi `useDeferredValue` ile ayır.
:::

## Özet

- Controlled input güncel state’i göstermeli; ağır liste farklı bir değeri tüketerek ertelenebilir.
- `useDeferredValue(value)` değerin daha sonra güncellenebilen kopyasını verir; sabit süre beklemez ve ağ isteği azaltmaz.
- `useTransition` senin başlattığın state değişikliğini düşük öncelikli işaretler; `isPending` geçiş sürerken bilgi verir.
- Debounce zamana göre bekletir; deferred değer ve transition React’in arayüz işlerini sıraya koymasına yardım eder.

**Yeni terimler**

- **Controlled input:** Görünen değeri React state’inden alan input.
- **Ana iş parçacığı:** Tarayıcının JavaScript ve arayüz işlerini yürüttüğü ana hat.
- **Deferred value:** Daha ağır bir arayüz işinin tüketmesi için güncellenmesi ertelenebilen değer kopyası.
- **Transition:** Bir state değişikliğini acil olmayan, düşük öncelikli arayüz işi olarak işaretleme.
- **Debounce:** Yeni işlem başlamadan önce belirli bir süre sessiz kalınmasını bekletme tekniği.

**Kendini yokla**

1. Inputun `value` prop’u neden `deferredQuery` olmamalı? **Cevap:** Yazılan harfin kutuda hemen görünmesi gerekir; ertelenirse input da gecikir.
2. `useDeferredValue` API çağrısı sayısını azaltır mı? **Cevap:** Hayır. Ağ isteği sayısı için debounce gibi ayrı bir istek politikası gerekir.
