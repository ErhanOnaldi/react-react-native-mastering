## Neden böyle?

`reset()` formu varsayılanlara döndürür; bunu sunucunun cevabına bakmadan her gönderimden sonra çağırmak, başarısız bir isteği görsel olarak başarılıymış gibi gösterir. `response.ok` kontrolü ile hata dalını ayırıp yalnızca başarı dalında `reset()` çağırmak, kullanıcının seçtiği değeri hata sonrasında da ekranda tutar.

Alternatif olarak `formState.errors` üzerinden RHF'nin kendi hata mekanizmasını kullanabilir, sunucu hatasını `setError('root', ...)` ile forma bağlayabilirsin; görünüm aynı kalır. Modül 13'te gördüğün `useMutation`'ın `onError`/`onSuccess` ayrımı da bu formu aynı kuralla besler: `reset()` yalnızca `onSuccess`'te çağrılır. İki yaklaşımda da kritik nokta aynı: başarısız bir yazma işleminden sonra kullanıcının girdisini yok etme. İleride giriş formunda (Modül 17) aynı kural şifre alanına değil, yalnızca kullanıcı adına uygulanacak.
