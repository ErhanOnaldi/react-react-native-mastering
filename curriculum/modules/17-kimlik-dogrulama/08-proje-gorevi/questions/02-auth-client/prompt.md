Profil ve kullanıcı menüsündeki hesap rozeti aynı anda 401 alıyor. İki refresh isteği yarışırsa ikincisi 403 oluyor.

## Sözleşme

`src/features/auth/authClient.ts` dosyasından `createAuthClient(storage)` ve uygulamada kullanılan `authClient` export et. Factory, egzersizdeki gibi `storage.getTokens()` / `storage.setTokens(tokens)` bağımlılığını alır ve `{ get<T>(path): Promise<T> }` döndürür. `path` DummyJSON’a göre `/auth/me` gibi kökten başlar.

- GET’e güncel Bearer access token ekle.
- 401’de `/auth/refresh` ile yeni **iki** token al; 2 paralel 401 için yalnız 1 refresh at.
- Her ilk isteği yeni access token’la bir kez tekrar dene. Retry da 401 ise dur.
- 403’te temiz çıkış akışına geç; 401 dışındaki hataları refresh etme.
- Varsayılan `authClient` gerçek store ve kalıcı token deposuna bağlı olsun. `/profile` güncel profil verisini bu client üzerinden göstersin; eski oturumun profili görünmesin.

Test, `vi.setSystemTime` ile access token’ı sona erdirip `/auth/refresh` istek sayısını ölçer.
