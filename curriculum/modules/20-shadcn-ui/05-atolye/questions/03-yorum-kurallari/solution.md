## Neden böyle?

Başlık ve metnin **ayrı ayrı** dolu olması yeterli değil: ikisi birlikte anlamlı bir yorum oluşturmalı. Zod'da tek alan kuralları (`.min(1)`) şemanın kendi şekliyle tanımlanır; birden fazla alanı birlikte değerlendiren kural ise `.refine()` ile eklenir ve `path` ile hatayı hangi alanda göstereceğini seçersin. Böylece "ikisi de dolu ama ikisi birlikte kısa" durumunu tek bir yerde yakalarsın.

Sunucu hatasında formu **sıfırlamamak** kritik: `reset()` yalnızca başarı yolunda çağrılır. `try/catch` içindeki `catch` bloğu yalnızca durumu `'error'`e çeker, alanlara dokunmaz — kullanıcı her şeyi yeniden yazmak zorunda kalmaz.

**Alternatif:** Cross-field kuralını `.refine()` yerine `.superRefine()` ile de yazabilirsin; birden fazla hata birikeceği durumlarda (örn. hem uzunluk hem yasaklı kelime kontrolü) `superRefine` her ihlali ayrı `ctx.addIssue` ile ekleyebildiği için daha esnektir. Tek kural için `.refine()` yeterli ve daha az kod.

**Tuzaklar:**
- `.refine()`'ı `.object({...})`'den SONRA zincirlersen, yalnızca tekil alan kuralları geçtiğinde çalışır — boş bir alanla göndermeyi ayrıca engellemene gerek kalmaz ama refine hata mesajının hangi durumda tetiklendiğini test ederken bunu unutma.
- Başarı durumunu `isSubmitting` yerine ayrı bir `status` state'iyle takip etmek, art arda başarısız/başarılı denemelerde eski mesajın ekranda asılı kalmasını önler.
- DummyJSON `/comments/add` gerçek uçta yalnızca `body` alanını zorunlu tutar; başlık+metin kuralın tamamen istemci tarafı bir ürün kararıdır — sunucu bunu doğrulamaz, bu yüzden istemci tarafı doğrulamayı atlarsan sunucu seni durdurmaz.

Bitirme projesinde (22. modül) aynı "sunucu hata verirse veriyi kaybetme" ilkesini gerçek bir Open Library formunda tekrar kuracaksın.
