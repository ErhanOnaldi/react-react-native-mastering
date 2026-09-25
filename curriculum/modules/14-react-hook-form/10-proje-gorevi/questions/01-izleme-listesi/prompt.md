Sinema'da izleme listesi oluşturma akışını ekle. Dosya ve export sözleşmesi:

- `src/features/watchlists/types.ts`: `Watchlist` tipini export et. `id: string`, `createdAt: string`, `name: string`, `description: string`, `isPublic: boolean`, `tags: { value: string }[]` alanları olsun. `WatchlistValues = Omit<Watchlist, 'id' | 'createdAt'>` tipini export et. İleride düzenleme yaması için `WatchlistPatch = Partial<WatchlistValues>` tipini de export et.
- `src/features/watchlists/useWatchlists.ts`: named export `useWatchlists()`. `{ watchlists, addWatchlist }` döndürsün. `addWatchlist(values: WatchlistValues)` yeni `id` ve ISO `createdAt` ekleyip `localStorage` anahtarı `sinema:watchlists` altında JSON dizi olarak saklasın. Hook'un güncel `watchlists` değeri de yeni listeyi göstersin.
- `src/features/watchlists/WatchlistForm.tsx`: named export `WatchlistForm`. `useForm<WatchlistValues>` ile ad, açıklama, herkese açık checkbox ve `useFieldArray` ile dinamik etiketleri göster. “Etiket ekle” ve “Etiket N sil” düğmeleri olsun. Ad zorunlu; boş ad için “Ad gerekli” alert'i göster. Başarılı kayıtta `addWatchlist` çağır, “Liste kaydedildi” durumu göster ve formu sıfırla.

Tüm alanları görünür label ile bağla. Testler sayfa düzenini değil, form ve localStorage davranışını denetler. `useWatchlists` sonucunu başka bir bileşende de kullanabilmelisin.
