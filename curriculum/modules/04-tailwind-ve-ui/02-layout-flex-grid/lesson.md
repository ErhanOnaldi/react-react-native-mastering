---
title: Posterleri yerleştir
minutes: 8
kind: concept
---

# Posterleri yerleştir

:::pain[Problem]
On iki film kartı telefonda taşıyor, geniş ekranda tek sütun boşluk bırakıyor. Kart içindeki puan da uzun başlığın üstüne biniyor.
:::

## İki düzen ihtiyacı

Kart **içinde** yatay ilişkiler için `flex`, kartlar **arasında** iki boyutlu ızgara için `grid` kullan. `gap` çocuklar arasındaki boşluğu verir; her çocuğa margin eklemen gerekmez.

```tsx check
type Movie = { id: number; title: string }
export function MovieGrid({ movies }: { movies: Movie[] }) {
  return <section aria-label="Filmler" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {movies.map(movie => <article key={movie.id} className="min-w-0 rounded-xl border p-3">
      <div className="flex items-center justify-between gap-2"><h2 className="truncate">{movie.title}</h2><span>★</span></div>
    </article>)}
  </section>
}
```

Çıplak `grid-cols-2` dar ekranda da geçerlidir. `sm:` ve `lg:` eşiklerden **itibaren** üzerine yazar; belirli cihazları değil viewport genişliğini anlatır. Önizlemeyi daraltıp genişleterek 2 → 3 → 4 sütunu izle.

`min-w-0`, uzun film adına rağmen kart içeriğinin küçülmesine izin verir; `truncate` taşan metni kısaltır. `key={movie.id}` filtreleme sırasında React'in doğru kartı korumasını sağlar.

:::mistake[Sık hata]
`sm:grid-cols-3` "küçük ekranda üç" demek değildir. Önce dar ekranın temel düzenini yaz, sonra geniş ekrana geç.
:::
