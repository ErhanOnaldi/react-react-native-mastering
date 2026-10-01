## Neden böyle?

RHF alan durumunu ve submit akışını yönetir; Zod tek kural kaynağıdır. `register('name', { required: ... })` ile ikinci kural listesi kurarsan drift geri gelir. Hata mesajının ekranda erişilebilir olması da şemanın değil bileşenin sorumluluğudur.

## Alternatif, tuzak ve devamı

`register` içinde tekrar `required` yazmak iki kural listesini geri getirir. `aria-invalid` hata durumunu yardımcı teknolojiye iletir. Sonraki görevde input ile submit tipleri farklılaşacak.
