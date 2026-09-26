## Neden böyle?

Detay isteği `id` değerine bağlıdır. Effect yalnızca ilk açılışta çalışırsa bileşen açık kaldığı sürece ilk filmi göstermeye devam eder. `id` değiştiğinde yeni isteği başlatıp eski detayı gizlemek, beklerken yanlış filmi göstermeyi önler.

Alternatif olarak detay bileşenini `key={id}` ile yeniden kurabilirsin; bu da yeni istek başlatır ve iç state'i sıfırlar. Fakat kimlik bağımlılığını effect'te açık tutmak aynı bileşen içinde daha anlaşılırdır. Yalnızca `id` bağımlılığı eklemek de geç gelen eski cevabın yeniyi ezmesi riskini bırakır; önceki görevdeki cleanup yaklaşımı bu durumda da kullanılabilir. Modül 6'da id URL'den geldiğinde aynı davranışı koruyacaksın.
