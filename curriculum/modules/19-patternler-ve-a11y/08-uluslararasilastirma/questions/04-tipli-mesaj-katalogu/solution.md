## Neden böyle?

`Message` iki nesne biçiminden oluşur. `key` alanı hangi biçimin geldiğini söyler; `message.key === 'movieCount'` koşulundan sonra TypeScript `count` alanını, `welcome` dalında ise `name` alanını tanır. Böylece film sayısı mesajına ad göndermek derleme hatası olur.

Her iki dil de aynı iki mesajı üretir. Bu örnekte İngilizce çoğul için `count !== 1` yeterli; gerçek dil kurallarında `Intl.PluralRules` ya da bir i18n kütüphanesi kullanılabilir. Burada önemli olan mesajın ihtiyaç duyduğu veriyi doğru biçimde taşımaktır.
