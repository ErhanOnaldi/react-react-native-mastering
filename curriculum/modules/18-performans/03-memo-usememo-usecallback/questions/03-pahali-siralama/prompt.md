Filmler puanlarına göre sıralanarak listeleniyor. Tema değişince sıralama yeniden çalışmasın; `rank` fonksiyonu kendi girdisini değiştirse bile kaynak film listesi aynı kalsın.

## Gereksinimler
- Verilen filmleri `rank` fonksiyonu ile sıralayarak numaralı liste (`<ol> > <li>`) içinde film başlıklarını göster.
- Tema (`theme`) prop'u değiştiğinde sıralama fonksiyonunun tekrar çalışmasını engelle; önceki hesaplama sonucunu koru.
- Yalnızca `movies` dizisi veya `rank` fonksiyonu referansı değiştiğinde sıralamayı yeniden hesapla.
- `rank` fonksiyonuna verilen dizinin değiştirilmesi, `movies` prop'unu değiştirmemelidir.

## Örnek
`movies` değişmediği sürece `theme` değeri "dark"tan "light"a geçtiğinde sıralama fonksiyonu tekrar çalışmaz. `rank` girdi dizisini sıralasa bile `movies` içindeki sıra korunur.

## Sözleşme
- Dosya ve export: `RankedMovies.tsx` → `RankedMovies(props: { movies: Movie[], theme: string, rank: (items: Movie[]) => Movie[] })`
- Tip tanımı:
  ```ts
  export interface Movie {
    id: number
    title: string
    score: number
  }
  ```
- Arayüz: `section[data-theme]` içinde `<ol> > <li>{title}</li>`.
