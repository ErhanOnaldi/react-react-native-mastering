Bir kullanıcı puan verirken başka route’a geçti; butonun yerel hata mesajını görmedi. `makeClient(notify)` fonksiyonu yaz.

- Yeni `QueryClient` ve `MutationCache` oluştur.
- Her başarısız mutation’da `notify('İşlem kaydedilemedi')` çağır.
- Query ve mutation retry’larını kapat; testte hata tek kez bildirilsin.

Yerel mutation `onError` yine rollback yapabilir. Bildirimde token/session id bulunmasın.
