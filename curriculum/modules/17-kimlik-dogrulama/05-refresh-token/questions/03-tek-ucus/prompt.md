Profil ve hesap rozeti aynı eski token’la istek yaptı. İkisi 401 alınca iki refresh gönderilirse ikinci 403 olur.

## Görev

`createAuthClient(storage)` → `{ get<T>(path): Promise<T> }` yaz. `refreshSession.ts` salt okunur yardımcı dosyada hazır.

- `get` DummyJSON taban URL’sine GET atar; varsa access token’ı Bearer başlığına ekler.
- 401 dışındaki hata status ile fırlatılır; refresh yapılmaz.
- 401’de ortak, **tek** refresh başlatılır. Paralel istekler aynı sonucu bekler; başarılıysa her orijinal istek yeni token ile yalnız bir kez tekrarlanır.
- Refresh 403 veya retry 401 olursa hata fırlat. Sonsuz döngü kurma.
- Daha sonra tekrar süre dolarsa yeni refresh başlatılabilsin.

Test iki paralel `/auth/me` isteğinden sonra `requests('/auth/refresh')` sayacını **1** bekler. Ayrıca ilk token’ın `exp` değerinden sonraya sahte saatle geçer.
