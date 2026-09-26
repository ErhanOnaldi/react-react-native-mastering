Bir taslak seçip başlığını değiştir, sonra listeden başka bir taslağa geç. Form yeni taslağın değerlerini göstermez, önceki taslaktan kalan yazıyı göstermeye devam eder.

Ayrıca bitiş tarihini tamamen sil (alanı boşalt) ve gönder: bazen kabul ediliyor, bazen bir hata çıkıyor ama hangi durumda ne olacağı tutarlı değil. Yalnızca gerçekten geçersiz bir tarih yazıldığında (ör. `10 Ocak`) hata beklenir; boş bırakmak "tarih yok" anlamına gelmeli ve sorunsuz gönderilebilmeli.

`DraftEditor.tsx` içindeki `DraftEditor` bileşeni bu iki belirtiden kurtulmalı.

## Arayüz sözleşmesi

- Geçersiz tarihte gösterilen hata mesajı `Geçerli bir tarih` ifadesiyle başlasın.
