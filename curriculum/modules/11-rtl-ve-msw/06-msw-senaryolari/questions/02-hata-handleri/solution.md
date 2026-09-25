## Neden böyle?
Handler factory farklı hata statülerini tek satırla deneyebilmeni sağlar. `server.resetHandlers()` sonraki testin varsayılan cevaba dönmesini sağlar. Buradaki sınır doğrulaması test hatasını yanlışlıkla 200 yanıtı olarak saklamaz.
