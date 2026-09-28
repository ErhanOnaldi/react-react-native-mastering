Seçili film değiştiğinde yeni detay durumunu göster; önceki isteğin geç cevabı yeni filmi ezmesin.

## Gereksinimler

- Başlangıç durumu `loading` olsun; yükleyici seçili id ile çalışsın.
- Id değişince yeni yükleme başlasın ve önceki isteğe ait signal iptal edilsin.
- Başarılı aktif istek `success` ve film bilgisini döndürsün.
- Aktif isteğin hatası `error` ve okunabilir mesaj olarak dönsün.
- Eski/iptal edilmiş isteğin geç cevabı görünür state'i değiştirmesin.

## Örnek

550 numaralı film başarıyla gösterildikten sonra id 603 olursa durum yeni istek için `loading` olur, ardından yalnızca 603 numaralı film `success` olarak görünür.

## Sözleşme

- Dosya ve export: `useMovieDetails.ts` → `useMovieDetails(id, load)`.
- `load`: `(id: number, signal: AbortSignal) => Promise<Movie>`; `Movie` tipi dosyada `{ id: number; title: string }` biçimindedir.
- Dönüş union'ı: `{ status: 'loading' }` | `{ status: 'success'; movie: Movie }` | `{ status: 'error'; message: string }`.

## Kısıtlar

- İptal edilmiş istek hata üretse bile error durumuna geçme.
