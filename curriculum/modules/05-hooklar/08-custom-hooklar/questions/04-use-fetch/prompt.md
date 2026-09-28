Birden fazla bileşende aynı ağ durumu yönetimi kopyalanıyor. `useFetch`, URL'ye bağlı olarak idle, loading, success ve error durumlarını tipli biçimde döndürsün.

## Gereksinimler

- `url` `null` ise durum `idle` kalır ve istek atılmaz.
- URL verildiğinde önce yüklenme durumu başlar, başarılı JSON cevabı `success` ve `data` olarak döner.
- HTTP `!ok` cevabı `error` durumuna çevrilir.
- TMDB istekleri yetkilendirme başlığıyla gider.
- URL değiştiğinde veya bileşen ayrıldığında eski istek iptal edilir.
- İptal edilen istek normal kullanıcı hatası gibi state'e yazılmaz.

## Örnek

`useFetch<{ title: string }>(TMDB_BASE + "/movie/550")` başarılı olduğunda `{ status: "success", data: { title: "Dövüş Kulübü" } }` biçiminde sonuç verir. `null` URL'de `{ status: "idle" }` döner.

## Sözleşme

- Dosya ve export: `useFetch.ts` → `useFetch<T>(url: string | null): RemoteData<T>`
- `RemoteData<T>` union'ı dosyada export edilir.
- Testler hook'u `renderHook` ile çalıştırır ve `/3/movie/550` isteğini gözler.
