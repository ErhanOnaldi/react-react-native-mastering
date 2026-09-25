Ad hatası görünüyor ama hangi input'a ait olduğu ekran okuyucu için belirsiz.

- “Liste adı” görünür label'ı input'a bağla.
- Geçersiz submit'te input `aria-invalid="true"` taşısın.
- Hata mesajının id'si ile input'un `aria-describedby` değeri eşleşsin.
- Geçerli ad gönderildiğinde `onSave` çalışsın.

Testler semantik sorgularla alanı bulur; placeholder yeterli değildir.
