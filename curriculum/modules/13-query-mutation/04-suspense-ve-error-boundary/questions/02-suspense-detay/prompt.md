Detayda üç ayrı loading koşulu vardı. `MovieDetail({ id, load })` bileşenini yaz; `load(id)` `{ id, title }` döndürür.

- `useSuspenseQuery` ile `['movie', id]` key’ini kullan.
- Başlığı `<h1>` içinde göster. 550’den 27205’e geçince key değişsin.
- Bileşenin içine `isPending` dalı koyma. Dışarıdaki Suspense fallback ve ErrorBoundary yükleme/hata durumlarını yönetecek.
