## Neden böyle?

Kontrollü input kullanınca "kullanıcı adını koru" gereksinimi zaten bedava gelir: state'i temizlemediğin sürece yazdığın değer ekranda kalır. Asıl iş iki yerde: hatayı `role="alert"` ile anons etmek (ekran okuyucu da yakalasın) ve gönderim sırasında düğmeyi `disabled` yaparak ikinci tıklamanın yeni bir istek başlatmasını engellemek. `pending` bayrağı olmadan iki hızlı tıklama iki ayrı `fetch` başlatır; ikisi de sunucuya gider ve hangisinin cevabının önce geleceği belirsizleşir.

**Alternatif yaklaşım:** React Hook Form kullanıp `formState.isSubmitting` ile aynı "gönderiliyor" bayrağını elde edebilirsin; `handleSubmit` zaten senkron çağrıları sıraya koyar. API hatasını `setError('root', { message })` ile gösterip `root.message`'ı `role="alert"` bir elemente bağlarsın. İkisi de aynı sözleşmeyi sağlar: buton devre dışı, hata okunur, alan değeri korunur.

**Tuzaklar:** `finally` bloğunda `pending`'i kapatmayı unutursan başarısız denemeden sonra buton sonsuza dek devre dışı kalır. Hata mesajını göstermeden önce `setError(null)` çağırmazsan, önceki hatanın üstüne yenisi eklenir ve iki `role="alert"` aynı anda görünebilir (testte `findByRole('alert')` tek eleman beklerken başarısız olur).

**Köprü:** 15. modülde bu forma alanlar arası kural (örn. bitiş tarihi başlangıçtan önce olamaz) ekleneceksin; 20. modülde ise aynı form bir modal içinde açılıp farklı kayıtlar arasında geçiş yapacak.
