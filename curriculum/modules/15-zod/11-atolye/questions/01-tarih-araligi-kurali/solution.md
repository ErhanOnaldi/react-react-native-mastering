## Neden böyle?

Tek alan kuralları (`min(1)` gibi) `startDate` ve `endDate`'i birbirinden habersiz doğrular. `.refine` bütün nesneyi görebildiği için ikisi arasındaki ilişkiyi ifade edebilir; `path: ['endDate']` sayesinde hata mesajı ilgili input'un altında çıkar, genel bir form hatası olarak kaybolmaz. `aria-invalid` ve `aria-describedby` olmadan hata yalnızca görsel kalır, ekran okuyucu kullanıcısı hangi alanın sorunlu olduğunu bilemez.

Alternatif olarak kuralı `handleSubmit`'in kendi callback'inde manuel `if` ile de yazabilirsin; ama o zaman kuralı API doğrulaması veya testlerle paylaşamazsın, RHF'nin hata gösterme mekanizmasına da elle bağlanman gerekir. Sık hata: `.refine`'ı `startDate` alanına değil objeye uygulamayı unutup yalnızca `endDate.min(startDate)` gibi statik bir kural yazmaya çalışmak — bu, `startDate` değiştiğinde güncellenmez.
