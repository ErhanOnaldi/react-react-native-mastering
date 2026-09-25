---
title: "Sinema’da kalıcı ve korumalı oturum"
minutes: 10
kind: project
---

# Sinema’da kalıcı ve korumalı oturum

:::pain[Sinema’da sorun]
Şimdi üç arıza aynı anda görünüyor: yenilemede çıkış, herkese açık watchlist ve süresi dolan token’ın sessiz 401’i. Küçük egzersizlerde kurduğun akışı gerçek Sinema sayfalarına bağla.
:::

## Uygulama sırası

1. `src/features/auth/` altında giriş formu ve `authSlice` kur. DummyJSON test hesabıyla `/login` sayfasından giriş yap; `/profile` sayfasında `/auth/me` verisini göster.
2. `authClient` Bearer başlığı eklesin; 401’de refresh token’ı bir kez kullansın, çift token’ı döndürsün ve orijinal isteği bir kez tekrarlasın.
3. `ProtectedRoute` layout’u `/watchlists` ve `/profile` için kullan. `/login` açık kalsın. Çıkışta Query cache, auth ve kullanıcıya ait store state’ini temizle.

Önceki modülün `store`, `RootState`, `AppDispatch`, `useAppSelector` ve `useAppDispatch` export’larını koru. TMDB’nin kendi Bearer token’ı DummyJSON oturumundan ayrıdır. Gerçek API testleri MSW üzerinde çalışır.

:::mistake[Sık hata]
`localStorage` token’ı yenilemeden sonra okumayı sağlar ama XSS’e açıktır. Bu örnekte ödünleşimi bilerek seç; cookie oturumunu istemci tarafında taklit etme.
:::
