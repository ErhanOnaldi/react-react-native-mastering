Testleri geçen ancak katı derleyici kuralları (`verbatimModuleSyntax`, `noImplicitAny`, `strictNullChecks`) nedeniyle tip denetiminden geçemeyen yardımcı fonksiyonları düzeltmek istiyoruz.

## Gereksinimler

- Fonksiyonların mevcut testleri başarıyla geçmeye devam etmeli, davranış değiştirilmemelidir.
- `Movie` arayüzü yalnızca tip olarak import edilmelidir.
- `isHighlyRated` fonksiyonunun parametre tipi açıkça `number` olarak tanımlanmalıdır.
- `titleById` fonksiyonu aranan id listede bulunamadığında güvenli bir şekilde `"Bilinmeyen film"` döndürmelidir.
- Dosyada hiçbir TypeScript derleyici hatası (`tsc`) kalmamalıdır.

## Örnek

| Çağrı | Sonuç |
| --- | --- |
| `isHighlyRated(8.2)` | `true` |
| `titleById(filmler, 550)` | `"Dövüş Kulübü"` |
| `titleById(filmler, 99999)` | `"Bilinmeyen film"` |

## Sözleşme

- Dosya ve exportlar: `movie-utils.ts`
  - `export function releaseYear(movie: Movie): string`
  - `export function isHighlyRated(score: number): boolean`
  - `export function titleById(movies: Movie[], id: number): string`
- Salt okunur bağımlılık: `types.ts`
