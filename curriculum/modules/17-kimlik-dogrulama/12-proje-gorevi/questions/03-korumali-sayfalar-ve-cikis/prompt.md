Sinema uygulamasında izleme listeleri ve profil sayfası gibi özel alanlara oturumsuz erişimi engelleyen, yetkisiz gezinmeleri giriş sayfasına yönlendiren ve çıkış yapıldığında oturum verilerini eksiksiz temizleyen akışı tamamla.

## Gereksinimler

- `ProtectedRoute` bileşeni oturum geçerliyse alt sayfaları görüntülemeli; oturum yoksa `/login` sayfasına geçmiş kaydını ezerek (`replace`) yönlendirmeli ve dönüş yolunu rota durumunda taşımalıdır.
- Router yapılandırmasında `/watchlists` ve `/profile` rotaları aynı korumalı layout altında toplanmalı; `/login` rotası ise genel erişime açık kalmalıdır.
- Başarılı giriş sonrasında kullanıcı, daha önce gitmek istediği rota durumu (`location.state.from`) varsa doğrudan o sayfaya yönlendirilmelidir.
- `logout` fonksiyonu istemci depolama kaydını (`'sinema-auth'`), kullanıcıya ait store durumunu ve önbellekteki tüm sorguları temizlemelidir.

## Örnek

| Durum / Eylem | Beklenen Davranış |
| --- | --- |
| Girişsiz kullanıcı `/watchlists` sayfasına gider | `/login` sayfasına yönlendirilir; hedef yol rota durumunda saklanır. |
| Kullanıcı giriş yapar ve `state.from` mevcuttur | Kullanıcı doğrudan `state.from` adresine yönlendirilir. |
| Kullanıcı "Çıkış Yap" eylemini tetikler | `'sinema-auth'` silinir, store sıfırlanır, sorgu önbelleği boşaltılır. |

## Sözleşme

- `src/features/auth/ProtectedRoute.tsx`:
  - `ProtectedRoute` bileşenini named export et. Props: `{ isAuthenticated: boolean }`
- `src/features/auth/logout.ts`:
  - `logout({ queryClient, storage, resetStore })` fonksiyonunu named export et.
- `src/router.tsx`:
  - `routes` ve `router` sembollerini export et; korumalı sayfalar `ProtectedRoute` altında konumlandırılmalıdır.
