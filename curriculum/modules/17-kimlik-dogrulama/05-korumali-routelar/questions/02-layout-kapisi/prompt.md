Kullanıcı oturumu bulunmadığında korumalı sayfalara erişimi engelleyen, yetkisiz gezinmeleri giriş sayfasına yönlendiren ve başarılı giriş sonrasında geri dönebilmek için hedef adresi koruyan bir layout kapısı bileşeni oluştur.

## Gereksinimler

- Oturum açık olduğunda alt çocuk rotalar arayüzde eksiksiz görüntülenmelidir.
- Oturum kapalı olduğunda kullanıcı `/login` adresine yönlendirilmeli ve bu yönlendirme tarayıcı geçmişinin üstüne yazılmalıdır (geçmişe yeni kayıt eklenmemelidir).
- Yönlendirme esnasında kullanıcının gitmek istediği özgün yol (`location.pathname`), giriş tamamlandıktan sonra geri dönebilmesi için rota durumu (`state.from`) olarak taşınmalıdır.
- Kapı bileşeni yolsuz bir ebeveyn layout olarak birden çok korumalı alt rotayı ortaklaşa yönetebilmelidir.

## Örnek

| Oturum Durumu | Ziyaret Edilen Rota | Beklenen Sonuç |
| --- | --- | --- |
| `isAuthenticated = true` | `/watchlists` | İzleme listesi içeriği doğrudan ekrana basılır. |
| `isAuthenticated = false` | `/watchlists` | `/login` sayfasına yönlendirilir; hedef `state: { from: '/watchlists' }` olarak aktarılır. |
| `isAuthenticated = false` | `/profile` | `/login` sayfasına yönlendirilir; hedef `state: { from: '/profile' }` olarak aktarılır. |

## Sözleşme

- `ProtectedRoute.tsx` dosyasından `ProtectedRoute` bileşenini named export et.
- Props sözleşmesi:
  - `{ isAuthenticated: boolean }`
