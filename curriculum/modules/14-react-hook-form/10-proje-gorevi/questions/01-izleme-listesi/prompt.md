Sinema'da kullanıcıların izleme listesi oluşturup daha sonra tekrar görebileceği akışı ekle. Liste adı ve isteğe bağlı ayrıntıları tarayıcıda sakla.

## Gereksinimler

- Formda ad, açıklama, görünürlük ve değişken sayıda etiket alanı olsun; her alan görünür label taşısın.
- Başlangıçta görünürlük özel (`false`), diğer metin alanları boş olsun. Etiket satırları `{ value: string }` şeklinde saklansın.
- Boş ad kaydedilmesin; “Ad gerekli” mesajı `role="alert"` ile gösterilsin.
- Kullanıcı etiket ekleyip silebilsin; kayıtta yalnızca kalan etiketler ve değerleri, sıraları korunarak saklansın.
- Başarıdan sonra “Liste kaydedildi” göster ve alanları başlangıç durumuna al.
- Her eklenen kayda benzersiz string id ve ISO tarihli `createdAt` ver.
- Saklanan yeni liste, hook'un güncel `watchlists` sonucunda da hemen görünsün.
- Hook'u form dışındaki bir bileşen de çağırdığında daha önce saklanan listeleri alabilsin.

## Örnek

`Hafta sonu`, açıklama `Kısa liste`, herkese açık ve `klasik`/`arkadaşlar` etiketleri kaydedilince aynı alanlarla tek kayıt saklanır. İlk etiket silinirse saklanan listede yalnız kalan etiket bulunur.

## Sözleşme

- `src/features/watchlists/types.ts`: `Watchlist`, `WatchlistValues`, `WatchlistPatch` tiplerini export et. `Watchlist` alanları `id: string`, `createdAt: string`, `name: string`, `description: string`, `isPublic: boolean`, `tags: { value: string }[]`. `WatchlistValues` kimlik/tarih içermez; `WatchlistPatch` bu form alanlarının alt kümesidir.
- `src/features/watchlists/useWatchlists.ts`: named export `useWatchlists()` → `{ watchlists, addWatchlist }`; `addWatchlist(values: WatchlistValues)` yeni kaydı eklesin.
- `src/features/watchlists/WatchlistForm.tsx`: named export `WatchlistForm`.
- Kalıcı kayıt anahtarı: `sinema:watchlists`.
- Arayüz: “Liste adı”, “Açıklama”, “Herkese açık”, “Etiket N”, “Etiket ekle”, “Etiket N sil”, “Kaydet” ve “Liste kaydedildi” adları.
