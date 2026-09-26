## Neden böyle?

İki hata birbirinden bağımsızdı. Birincisi: `/auth/me` reddedildiğinde (süresi dolmuş access token) kod bunu sessizce yutuyordu; `status` zaten `'loading'`ya ayarlanmıştı ve hiçbir dal onu değiştirmiyordu. DummyJSON'un bunun için bir çözümü var: `refreshToken` ile yeni bir jeton çifti almak. İkincisi: yeni bir girişe başlarken önceki `error` state'i hiç sıfırlanmıyordu; başarı bile eski hata mesajını ekrandan silmiyordu, çünkü hata banner'ı ile oturum görünümü birbirinden bağımsız render ediliyordu.

Çözüm: `loadProfile` önce mevcut access token'ı dener; reddedilirse `refreshToken`'ı `/auth/refresh`'e gönderip yeni jeton çiftiyle bir kez daha profil ister. İkinci deneme de başarısızsa kullanıcıya "tekrar giriş yap" mesajı gösterilir — sonsuza dek "Yükleniyor" kalmaz. `handleSubmit` her yeni denemenin başında `setError(null)` çağırır; böylece eski hata yeni denemenin başarısını gölgelemez.

**Alternatif yaklaşım:** Refresh mantığını `loadProfile`'ın içine gömmek yerine ayrı bir `withRefresh(tokens, fn)` yardımcısına çıkarabilirsin; bu, 5. görevdeki "tek uçuş" (`authClient`) fikrine daha yakın durur ve birden fazla isteğin aynı anda 401 alması gerektiğinde yeniden kullanılabilir.

**Tuzaklar:** Refresh de başarısız olursa (`refreshToken` süresi de dolmuşsa) kullanıcıyı sonsuz bir döngüye sokmamak için `status`'u `'error'` yap ve tekrar refresh deneme; yalnızca yeniden giriş formunu göster. `setError(null)`'ı yalnızca handleSubmit'in başında çağırmak yeterli — `loadProfile` kendi hata mesajını kendi set eder, ikisi çakışmaz.

**Köprü:** Bu ikili (401 → refresh → tekrar dene) modül 17'nin proje görevindeki `authClient`'ın tam olarak yaptığı şey; farkı, orada paralel isteklerin **tek** refresh'i paylaşması gerekiyordu. Sonraki görevde (`LoginPanel`) artık jeton yönetimi yok; yalnızca formun kendisi ve tekrar gönderim güvenliği var.
