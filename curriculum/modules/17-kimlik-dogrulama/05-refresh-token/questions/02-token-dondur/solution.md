## Neden böyle?

Rotation iki token’ı birlikte değiştirmeyi gerektirir. Yalnız access token’ı yenilersen bir saat sonra eski, tüketilmiş refresh token ile 403 alırsın. `response.ok` kontrolü 403’ü başarılı JSON sanmayı engeller.

`setTokens` tek çağrıda yapılır; Redux ve localStorage birlikte güncelleniyorsa kendi uygulamanda bu sınırı tutarlı kur. Refresh isteğine 401 interceptor’ı bağlama, yoksa tekrar zinciri oluşur. Sonraki görev aynı işlemi paralel istekler arasında paylaşır.
