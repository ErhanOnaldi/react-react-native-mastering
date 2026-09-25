## Neden böyle?

Oturum sınırı üç ayrı yerdeki veriyi kapsar: kalıcı token, client state ve server state cache’i. Yalnız redirect yapmak bunları temizlemez. `queryClient.clear()` eski kullanıcının verisini tutmaz; `invalidateQueries` ise cache’i yerinde bırakabilir.

Bu egzersizde Redux reset’i callback olarak geliyor; gerçek Sinema projesinde auth, watchlist ve kullanıcıya bağlı diğer slice’ların reset action’larını orada dispatch et. Refresh 403 aldığında da aynı temizliği kullan. Devamındaki performans derslerinde cache davranışını daha ayrıntılı ölçeceksin.
