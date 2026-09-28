Filmler puanlarına göre sıralanarak listeleniyor. Ancak kullanıcı arayüz temasını (açık/koyu mod) değiştirdiğinde pahalı sıralama fonksiyonu gereksiz yere baştan çalışıyor.

## Gereksinimler
- Verilen filmleri `rank` fonksiyonu ile sıralayarak numaralı liste (`<ol> > <li>`) içinde film başlıklarını göster.
- Tema (`theme`) prop'u değiştiğinde sıralama fonksiyonunun tekrar çalışmasını engelle; önceki hesaplama sonucunu koru.
- Yalnızca `movies` dizisi veya `rank` fonksiyonu referansı değiştiğinde sıralamayı yeniden hesapla.
- Giriş dizisini mutasyona uğratma (sıralama yeni bir dizi kopyası üzerinden yapılmalıdır).

## Örnek
`movies` değişmediği sürece `theme` değeri "dark"tan "light"a geçtiğinde sıralama fonksiyonu sıfır kez çalışır; ekrandaki sıralı liste aynen korunur.

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
