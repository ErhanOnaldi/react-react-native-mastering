Yorum formunda başlık ve metin birlikte anlamlı olmalı: ikisi de dolu olsa bile çok kısa bir başlık+metin ikilisi yeterli bir yorum sayılmaz. Sunucu hata döndürürse yazılanlar kaybolmamalı; kullanıcı formu değiştirmeden tekrar gönderebilmeli. Gönderim başarılı olursa bunu açıkça göster.

## Giriş ve davranış

Testler `ReviewPanel.tsx` içindeki `ReviewPanel` bileşenini açar.

- `Başlık` ve `Yorum` alanları vardır; ikisi de tek başına boş bırakılamaz.
- İkisi de dolu olsa bile toplamda çok kısaysa okunabilir bir hata gösterilir ve gönderim yapılmaz.
- Sunucu hata döndürürse: okunabilir bir hata mesajı görünür, yazılan başlık ve metin ekranda kalır.
- Sunucu başarıyla kabul ederse: açık bir başarı mesajı görünür.

Örnek: kısa başlık + kısa metin → hata, istek atılmaz. Yeterince uzun metinle gönder → sunucu hata verirse yazılanlar dursun; tekrar gönderilince başarı mesajı görünsün.
