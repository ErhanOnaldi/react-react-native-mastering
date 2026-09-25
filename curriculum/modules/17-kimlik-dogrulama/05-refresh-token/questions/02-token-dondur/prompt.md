İlk access token’ın süresi doldu. Elindeki refresh token ile yeni çift alman gerekiyor; eski refresh token ikinci kez kullanılamaz.

## Görev

`refreshSession(storage)` fonksiyonu:

1. `storage.getTokens()` ile eski çifti okur. Çift yoksa hata fırlatır.
2. `POST https://dummyjson.com/auth/refresh` adresine `{ refreshToken }` JSON’u yollar.
3. Başarılı yeni **iki** token’ı `storage.setTokens(...)` ile kaydeder ve döndürür.
4. 403 veya başka başarısız yanıtta hata fırlatır; storage’ı değiştirmez.

| Durum | Beklenen |
| --- | --- |
| Geçerli refresh token | Yeni access ve refresh token |
| Aynı eski refresh token’ı tekrar kullan | 403 hatası |

Bir sonraki görev iki paralel 401’in bu fonksiyonu tek kez paylaşmasını sağlayacak.
