---
title: "Memo gerçekten ne zaman gerekir?"
minutes: 17
kind: concept
---

# Memo gerçekten ne zaman gerekir?

Önceki derste gördün: bir parent render olunca çocukları da yeniden çalışabilir. Bu tek başına sorun değildir. Profiler'da pahalı bir alt ağaç gereksiz yere çalışıyorsa, üç aracı ayrı ayrı düşünebilirsin: `memo` bileşen çağrısını, `useMemo` hesaplanan değeri, `useCallback` ise fonksiyon referansını korumaya yarar. Aynı “memo” sözcüğüne benzemeleri, aynı işi yaptıkları anlamına gelmez.

Bir değeri tekrar kullanmak üzere saklamaya **memoization** denir. Amaç her render'ı yok etmek değil; aynı girdilerle yapılan pahalı işi yeniden yapmamak ya da `memo` ile sarılı çocuğa gereksiz yere yeni prop vermemektir. Önce en küçük örnekle başlayalım.

## Değişmeyen prop'u alan çocuk

Sinema ana sayfasındaki `FeaturedLabel` yalnızca sabit bir başlık gösteriyor olsun. Parent'ın sayaç state'i değişince parent yeniden render olur. Çocuk değişen hiçbir veri almıyorsa `memo` ile bu parent kaynaklı çağrıyı atlayabiliriz:

```tsx check
import { memo, useState } from 'react'

const FeaturedLabel = memo(function FeaturedLabel({ title }: { title: string }) {
  return <h2>Öne çıkan: {title}</h2>
})

export function HomeHeader() {
  const [visits, setVisits] = useState(0)
  return (
    <header>
      <button onClick={() => setVisits((value) => value + 1)}>Ziyaret {visits}</button>
      <FeaturedLabel title="Yol" />
    </header>
  )
}
```

Butona bastığında `HomeHeader` çalışır, fakat `FeaturedLabel` aynı `title` değerini aldığı için atlanabilir. `memo`'nun yaptığı şey budur: çocuğun kendi state'i değişirse yine render olur; `memo` onu kapatmaz.

## Nesne ve fonksiyonlar neden farklı görünür?

Şimdi tek yeni ayrıntı: `memo` props'ları `Object.is` ile karşılaştırır. Bu karşılaştırmaya **referans eşitliği** denir; nesne ve fonksiyonlarda içerik aynı görünse bile bellekteki kimliklerinin aynı olup olmadığı önemlidir.

Parent şöyle bir prop verirse her çalıştığında yeni nesne yaratır:

```tsx
<MoviePoster movie={{ id: 7, title: 'Yol' }} />
```

İki nesnenin alanları aynı olsa da referansları farklıdır. Bu yüzden `memo(MoviePoster)` yeni prop geldiğini görür ve çocuğu render eder. `memo` veri içeriğini derinlemesine incelemez; bu davranış, karşılaştırmanın ucuz ve öngörülebilir kalmasını sağlar.

## Pahalı hesaplamayı gerektiğinde yap

Bir film sayfasında kullanıcı türe göre seçim yapıyor olsun. Gösterilecek sonuçların filtrelenmesi büyük bir katalogda zaman alıyorsa, `useMemo` hesaplamayı yalnızca katalog veya tür seçimi değişince yenileyebilir:

```tsx check
import { useMemo, useState } from 'react'

type Movie = { id: number; title: string; genre: string }

export function GenreShelf({ movies }: { movies: Movie[] }) {
  const [genre, setGenre] = useState('Drama')
  const matchingMovies = useMemo(
    () => movies.filter((movie) => movie.genre === genre),
    [movies, genre],
  )

  return (
    <section>
      <button onClick={() => setGenre('Komedi')}>Komedi</button>
      <p>{matchingMovies.length} film</p>
    </section>
  )
}
```

`useMemo` içine verdiğin hesap yalnızca `movies` veya `genre` değişince tekrar çalışır. Başka bir state, örneğin görünüm sayacı değişirse önceki filtre sonucu kullanılır. Bu örnekte filtre ucuzsa `useMemo` gerekmeyebilir; ölçümde gerçek bir maliyet veya referans ihtiyacı gördüğünde kullan.

## Bir güncellemeyi adım adım izleyelim

`GenreShelf` açıldıktan sonra ilgisiz bir gösterim tercihi değiştiğini varsayalım. Girdi dizisi ve tür aynı kaldığı için filtre hesabı tekrar edilmez:

| Adım | Değişiklik | `useMemo` girdileri | Sonuç |
|---|---|---|---|
| 1 | İlk açılış | `movies`, `Drama` | Filtre çalışır, sonuç saklanır. |
| 2 | Görünüm tercihi güncellenir | İkisi de aynı | Filtre yeniden çalışmaz; saklanan sonuç kullanılır. |
| 3 | Tür `Komedi` olur | `genre` değişti | Filtre yeni türle yeniden çalışır. |
| 4 | `movies` yeni diziyle gelir | `movies` değişti | Filtre yeni katalogla yeniden çalışır. |

Bağımlılık listesi, hesabın hangi değerleri kullandığını React'e söyler. Listeye bir girdiyi koymazsan, o girdi değiştiğinde eski sonuç kullanılabilir. Listeye hesabın kullanmadığı sık değişen bir değeri eklersen de hesaplama gereksiz yere tekrar eder.

## Fonksiyon referansı ve closure

Bir fonksiyon başka bir fonksiyonun içinde tanımlandığında, oluşturulduğu andaki çevre değişkenlerini kullanabilir. Fonksiyonun bu erişim alanına **closure** denir. `useCallback`, fonksiyonun kendisini saklayıp belirttiğin girdiler değişene kadar aynı referansı sunar; fonksiyonu çalıştırırken daha hızlı yapmaz.

Örneğin film kartına tıklanınca o filmin detay sayfasını açan bir handler'ı `memo` ile sarılı karta veriyorsun. Parent'ın sayaç state'i değiştiğinde yeni inline fonksiyon üretmek yerine `useCallback` kullanabilirsin:

```tsx check
import { memo, useCallback, useState } from 'react'

const FilmLink = memo(function FilmLink({
  title,
  onOpen,
}: {
  title: string
  onOpen: (title: string) => void
}) {
  return <button onClick={() => onOpen(title)}>{title}</button>
})

export function FilmShelf({ title }: { title: string }) {
  const [visits, setVisits] = useState(0)
  const openFilm = useCallback((filmTitle: string) => {
    console.log('Film aç:', filmTitle)
  }, [])

  return (
    <section>
      <button onClick={() => setVisits((value) => value + 1)}>Ziyaret {visits}</button>
      <FilmLink title={title} onOpen={openFilm} />
    </section>
  )
}
```

Sayaç değişince `FilmShelf` render olur. `openFilm` referansı ve `title` aynı kaldığı için `FilmLink`'in props'ları eşit kalır; `memo` kartın render'ını atlayabilir. `useCallback` olmadan parent her çalıştığında yeni handler üretir, `memo` bunu farklı prop sayar.

## Eksik bağımlılık: gerçek bir yanlış ve düzeltmesi

Şimdi `openFilm` seçilen koleksiyon adını da kullanıyor olsun. `useCallback` içine `collection` değişkenini yazıp bağımlılık listesini boş bırakırsan, fonksiyon ilk oluşturulduğu render'daki adı görmeye devam eder. Bu davranışa **stale closure** (bayat closure) denir.

Belirti: ekranda “Komedi” koleksiyonu seçili olduğu halde tıklama eski “Drama” koleksiyonunu açar. Düzeltme, callback'in okuduğu değişkeni bağımlılık listesine eklemektir:

```tsx
const openFilm = useCallback(
  (filmTitle: string) => openInCollection(collection, filmTitle),
  [collection],
)
```

Şimdi `collection` değiştiğinde yeni callback oluşur ve yeni closure doğru değeri görür. Bağımlılık listesi boş olsun diye güncel veriyi feda etme; doğru davranış, `memo` tasarrufundan daha önemlidir.

:::model[Bayat closure]
Callback bağımlılıkları eksikse oluştuğu render’ın değerini kullanmaya devam edebilir.

![Callback fonksiyonu oluştuğu render'ın değerlerini yakalar](diagram:closure-bayat-deger)
:::

## Üç aracın farkı

Örnekleri gördükten sonra seçim şöyle özetlenir:

| Araç | Sakladığı | Sorabileceğin soru |
|---|---|---|
| `memo(Component)` | Çocuğun render sonucunu atlama kararı | Parent render oldu; çocuğun props'u aynı mı? |
| `useMemo(calculate, deps)` | Hesaplanmış değer | Bu hesaplamanın girdileri değişti mi? |
| `useCallback(fn, deps)` | Fonksiyon referansı | Bu handler'ı alan memo'lu çocuk için referans sabit mi? |

Hepsi bir maliyet taşır: React bağımlılıkları karşılaştırır ve bellekte değer saklar. Basit bir metin birleştirme için `useMemo` eklemek çoğu zaman gereksizdir. Önce Profiler'da problemi gör, sonra en küçük aracı uygula ve ölçümde gerçekten iyileşme olup olmadığına bak.

## Özet

- `memo`, parent render'ında props'u eşit kalan çocuğun render'ını atlayabilir.
- `useMemo`, bağımlılıkları değişmeyen hesaplamanın sonucunu yeniden kullanır.
- `useCallback`, fonksiyonu hızlandırmaz; fonksiyon referansını korur.
- Bağımlılık listesini eksik bırakmak eski render değerini kullanan stale closure'a yol açabilir.
- Memo araçlarını her yere ekleme; önce gerçek maliyeti ölç ve gereksizse sade kodu koru.

**Yeni terimler**

- **Memoization:** Aynı girdilerde üretilen değeri veya sonucu yeniden kullanmak için saklama.
- **Referans eşitliği:** İki nesne ya da fonksiyonun aynı kimlikte olup olmadığını karşılaştırma; `Object.is` kullanılır.
- **Closure:** Fonksiyonun tanımlandığı yerdeki değişkenlere erişimini koruması.
- **Stale closure:** Eski render'dan kalan closure'ın güncel olması gereken eski değeri kullanması.

### Kendini yokla

1. `useCallback` fonksiyonun içindeki işi hızlandırır mı?
   **Cevap:** Hayır. Fonksiyon referansını korur; çağrıldığında yaptığı iş aynı kalır.
2. `useCallback(() => openFilm(collection), [])` neden yanlış sonuç verebilir?
   **Cevap:** `collection` ilk render'ın closure'ında kalabilir. Değişen değer bağımlılık listesine eklenmelidir.
