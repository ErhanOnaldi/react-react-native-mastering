# Sinema’da Provider ve kalıcılık

Slice’lar hazır ama sayfa yenilenince tercihlerin kayboluyor. Beşli Context zincirini kaldırıp `src/main.tsx` içinde `<Provider store={store}>` kur. Mevcut TanStack Query provider’ı çalışmaya devam etsin.

## Gereksinimler

- `src/app/store.ts` içinde `createListenerMiddleware` ile `toggleFavorite`, `createWatchlist`, `addMovie`, `setTheme`, `viewMovie` action’larını dinle. Reducer sonrası güncel client state’i `localStorage` üzerinde `sinema:client-state` anahtarına JSON olarak yaz. Başlangıçta geçerli kayıt varsa yükle; bozuk JSON’da varsayılan state ile devam et. Storage erişimi yoksa uygulama açılabilmeli.
- Favori UI’si `useAppSelector(state => state.favorites.ids.includes(movieId))` gibi dar seçim yapsın; action’ı `useAppDispatch` ile gönder. Tema ve watchlist tüketicileri de kendi alanlarını seçsin.
- Render sayacını bir tema tüketicisinde veya favori dışındaki bileşende göster/ölç. Başlangıç değerini kaydet, yalnız favori action’ı gönder, artışı karşılaştır. React StrictMode yüzünden mutlak sayıyı sabitleme. Favori action’ı alakasız tema tüketicisinin render’ını artırmamalı.
- TMDB veri sorguları Query’de kalsın. Film detayını Redux’a kopyalama.

## Kontrol

Dövüş Kulübü (550) favorisini ekle, sayfayı yenile, favorinin kaldığını gör. Sonra Matrix (603) detayına git; son bakılanlarda sırayı ve tema tercihini kontrol et. Aşağıdaki test `setupStore()` üzerinden listener’ın yeni state’i yazmasını sınar.
