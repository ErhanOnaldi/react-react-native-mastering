Popüler filmler listesinin ilk başlığı küçük bir bileşende gösterilecek. Veri beklenirken kullanıcı boş ekran görmemeli.

## Gereksinimler

- Bileşen ilk açıldığında `Yükleniyor` metni görünür.
- `/movie/popular` cevabı geldikten sonra ilk film başlığı görünür.
- Test verisinde ilk başlık `Örümcek-Adam: Yepyeni Bir Gün` değeridir.
- TMDB isteği yetkilendirme başlığıyla gider ve yalnızca liste endpoint'ine yapılır.

## Örnek

| Aşama | Görünen |
| --- | --- |
| İlk render | `Yükleniyor` |
| Cevap sonrası | `Örümcek-Adam: Yepyeni Bir Gün` |

## Sözleşme

- Dosya ve export: `PopularTitles.tsx` → `PopularTitles`
- Testler `/3/movie/popular` isteğini ve ekrandaki ilk başlığı kontrol eder.
