# Sinema’da Provider ve kalıcılık

Slice’lar hazır ama sayfa yenilenince tercihlerin kayboluyor. Beşli Context zinciri kalksın; `src/main.tsx` uygulamaya Redux store’unu sağlasın. Mevcut TanStack Query provider’ı çalışmaya devam etsin.

## Gereksinimler

- Favori, watchlist, tema veya son bakılanlar değişince güncel client state `localStorage` üzerinde `sinema:client-state` anahtarına JSON olarak yazılsın. Başlangıçta geçerli kayıt varsa yüklensin; bozuk JSON’da varsayılan state ile devam edilsin. Storage erişimi yoksa uygulama açılabilmeli.
- Favori UI’si yalnız kendi filmi için gereken değeri izlesin. Tema ve watchlist tüketicileri de yalnız kendi alanları değişince güncellensin.
- Render sayacını bir tema tüketicisinde veya favori dışındaki bileşende göster/ölç. Başlangıç değerini kaydet, yalnız favori action’ı gönder, artışı karşılaştır. React StrictMode yüzünden mutlak sayıyı sabitleme. Favori action’ı alakasız tema tüketicisinin render’ını artırmamalı.
- TMDB veri sorguları Query’de kalsın. Film detayını Redux’a kopyalama.

## Kontrol

Dövüş Kulübü (550) favorisini ekle, sayfayı yenile, favorinin kaldığını gör. Sonra Matrix (603) detayına git; son bakılanlarda sırayı ve tema tercihini kontrol et. Aşağıdaki test `setupStore()` üzerinden listener’ın yeni state’i yazmasını sınar.
