Sinema’nın client tercihleri sayfa yenilendikten sonra da korunmalı; tercih değişikliği ilgisiz arayüz parçalarını güncellememeli.

## Gereksinimler

- Favori, watchlist, tema veya son bakılanlar değişince güncel client state `localStorage` üzerinde `sinema:client-state` anahtarına JSON olarak yazılsın. Başlangıçta geçerli kayıt varsa yüklensin; bozuk JSON’da varsayılan state ile devam edilsin. Storage erişimi yoksa uygulama açılabilmeli.
- Favori UI’si yalnız kendi filmi için gereken değeri izlesin. Tema ve watchlist tüketicileri de yalnız kendi alanları değişince güncellensin.
- Render sayacını bir tema tüketicisinde veya favori dışındaki bileşende göster/ölç. Başlangıç değerini kaydet, yalnız favori action’ı gönder, artışı karşılaştır. React StrictMode yüzünden mutlak sayıyı sabitleme. Favori action’ı alakasız tema tüketicisinin render’ını artırmamalı.
- TMDB veri sorguları Query’de kalsın. Film detayını Redux’a kopyalama.

## Örnek

Bir favori ve koyu tema seç; sayfayı yenileyince ikisi de korunmalı. Bozuk kayıt varsa varsayılan görünümle açılmalı.

## Sözleşme

- `src/app/store.ts` → `setupStore()` kurulumunda persistence bağlantısı
- `src/main.tsx` → uygulama ağacı store Provider altında; mevcut Query Provider korunur
- `src/features/favorites/store/favoritesSlice.ts` → `toggleFavorite(id: number)`
- `src/features/ui/store/uiSlice.ts` → `setTheme(theme: "light" | "dark")`
- Storage anahtarı: `sinema:client-state`; saklanan client alanları JSON biçimindedir

## Kısıtlar

- Kalıcılık reducer dışında çalışır.
- TMDB sorguları Query’de kalır; film detayları Redux’a kopyalanmaz.
- Render sayacında sabit mutlak sayı yerine etkileşim öncesi/sonrası farkını ölç.
