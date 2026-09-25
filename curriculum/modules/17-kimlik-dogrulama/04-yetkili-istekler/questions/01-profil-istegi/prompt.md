Login sonrası token var ama `/auth/me` başlıksız isteğe 401 veriyor.

## Görev

`getProfile(accessToken)` fonksiyonunu yaz:

- `GET https://dummyjson.com/auth/me` isteğine `Authorization: Bearer <accessToken>` ekle.
- Başarılı yanıttan `{ id, username }` döndür.
- 401 dahil her başarısız yanıtta status içeren `Error` fırlat.

| Token | Beklenen |
| --- | --- |
| Login’den gelen access token | `username: 'emilys'` |
| Boş veya süresi dolmuş token | Hata; sahte profil yok |

Bu adımda refresh yok. 401’i görünür kılmak, sonraki dersin başlangıç noktası.
