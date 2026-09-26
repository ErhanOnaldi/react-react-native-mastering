Sinema'da izleme listesi oluşturma akışını ekle. Dosya ve export sözleşmesi:

- `src/features/watchlists/types.ts`: `Watchlist`, `WatchlistValues` ve `WatchlistPatch` tiplerini export et. Tam kayıtta `id: string`, `createdAt: string`, `name: string`, `description: string`, `isPublic: boolean`, `tags: { value: string }[]` olsun. Form değerleri `id` ve `createdAt` içermez; yama tipi bu form alanlarının herhangi bir alt kümesini kabul eder.
- `src/features/watchlists/useWatchlists.ts`: named export `useWatchlists()`. `{ watchlists, addWatchlist }` döndürsün. `addWatchlist(values: WatchlistValues)` yeni `id` ve ISO `createdAt` ekleyip `localStorage` anahtarı `sinema:watchlists` altında JSON dizi olarak saklasın. Hook'un güncel `watchlists` değeri de yeni listeyi göstersin.
- `src/features/watchlists/WatchlistForm.tsx`: named export `WatchlistForm`. Ad, açıklama, herkese açık checkbox ve dinamik etiket alanlarını göster. “Etiket ekle” ve “Etiket N sil” düğmeleri olsun. Ad zorunlu; boş ad için “Ad gerekli” alert'i göster ve kayıt yapma. Başarılı kayıtta `addWatchlist` çağır, “Liste kaydedildi” durumu göster ve formu sıfırla.

Tüm alanları görünür label ile bağla. Testler sayfa düzenini değil, form ve localStorage davranışını denetler. `useWatchlists` sonucunu başka bir bileşende de kullanabilmelisin.
