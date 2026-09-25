---
title: "Sinema: Puanlama akışı"
minutes: 8
kind: project
---

# Sinema: Puanlama akışı

:::pain[Problem]
Sinema’nın Query tabanlı sayfaları hızlı. Fakat bir filme verdiğin puan gerçek TMDB’ye yazılmıyor; yazsan bile Puanladıklarım listesi eski kalıyor. Bu modülde çalıştırdığın küçük akışları projede birleştir.
:::

## Üç teslim

1. Guest session’ı saklayan API ve `ratedMoviesQuery` tarifini ekle.
2. `useRateMovie` ile optimistic listeyi kur; `RatingStars` ve `/rated` sayfasını bağla. Başarılı POST/DELETE ile tutarlılığı koru; hata olursa geri al.
3. Film detayında `useSuspenseQuery`, yakınında ErrorBoundary ve route loader’da `ensureQueryData` kullan. Loader ile bileşen aynı `movieQueries.detail(id)` tarifini paylaşsın.

Network sekmesinde önce `GET /authentication/guest_session/new`, sonra `POST /movie/550/rating`, sonra `GET /guest_session/.../rated/movies` akışını izle. 500 hatası denemesinde yıldız ve liste eski değere dönmeli.

:::sector
TMDB guest session kimliği kullanıcı hesabı değildir; yalnızca bu puanlama akışını tanımlar. Sonraki kimlik doğrulama modülünde gerçek oturumun yaşam döngüsünü ayrıca ele alacağız.
:::
