Sayfalanmış film listesi cevabı yalnızca film dizisinden oluşmaz; mevcut sayfa numarası ve toplam sayfa gibi meta verileri de barındırır. `MovieListResponse` yapısını modellemeli ve gelen sayfadaki film başlıklarını listeleyen `pageTitles` fonksiyonunu yazmalısın.

## Gereksinimler

- `Movie` arayüzünü tanımla ve export et:
  - `id`: sayı
  - `title`: metin
  - `poster_path`: metin veya `null`
  - `release_date`: metin
- `MovieListResponse` arayüzünü tanımla ve export et:
  - `page`: sayı
  - `results`: `Movie[]`
  - `total_pages`: sayı
  - `total_results`: sayı
- `pageTitles` fonksiyonu, verilen `MovieListResponse` nesnesinin `results` dizisindeki her filmin `title` alanını sırayla bir metin dizisi (`string[]`) olarak döndürmelidir.
- `results` boş dizi ise boş dizi (`[]`) döndürülmelidir.

## Örnek

| Girdi (`response`) | Çıktı |
| --- | --- |
| `{ page: 1, results: [{ id: 550, title: "Dövüş Kulübü", poster_path: null, release_date: "" }], total_pages: 2, total_results: 21 }` | `["Dövüş Kulübü"]` |
| `{ page: 2, results: [], total_pages: 2, total_results: 21 }` | `[]` |

## Sözleşme

- Dosya: `tmdbList.ts`
- Tip export'ları: `interface Movie`, `interface MovieListResponse`
- Fonksiyon export: `pageTitles(response: MovieListResponse): string[]`
