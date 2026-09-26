## Neden böyle?

Form kütüphanesi `record` prop'unu yalnızca ilk render'da `defaultValues` olarak okur; sonraki render'larda tekrar okumaz. Kayıt değişip pencere açık kalırsa bu yüzden eski değerler ekranda asılı kalır. Kaydın kimliğini (`record.id`) izleyip değiştiğinde formu elle `reset` etmek, doğru anda tazelenmesini garanti eder — 14. modülde gördüğün `reset`/`defaultValues` ilişkisinin aynısı, burada "modal açıkken veri değişebilir" bağlamına taşınmış hâli.

Hata odağı için ekstra kod yazmadık: doğrulama çözücüsü kullanan form kütüphaneleri geçersiz gönderimde varsayılan olarak ilk hatalı alana odaklanır. Bu, `a11y.focus` gereksinimini bedavaya getirir — kendi `focus()` çağrını eklemen gerekmez.

**Alternatif:** `record` değiştiğinde pencereyi tamamen `key={record.id}` ile yeniden mount edebilirsin; bu da formu sıfırdan kurar ve aynı davranışı sağlar. Basit ama pencere her seferinde yeniden mount olduğu için varsa geçiş animasyonu da sıfırlanır — büyük formlarda `reset` çağırmak daha ucuzdur.

**Tuzaklar:**
- `reset`'i yalnızca `record` referansı değişince değil, `record.id` gibi asıl değişen değere bağlı çalıştır; yoksa parent her render'da yeni bir nesne oluşturursa kullanıcının yazdığı taze değerler de silinir.
- `email` alanını `z.string()` ile bırakıp formatı elle kontrol etmeye çalışma; `z.email()` hem daha az kod hem tutarlı bir mesaj verir.

Bir sonraki adımda (22. modül) aynı "seçili kayda göre formu doldur" deseni, API'den gelen gerçek bir kayıtla karşına çıkacak — kaynak `useState` değil `useQuery` olacak.
