TMDB istekleri yetkilendirme anahtarıyla yapılmalı; başarısız HTTP cevabı film verisi gibi dönmemeli. Başarılı JSON, çağıranın verdiği tipte sonuç olarak sunulacak.

## Gereksinimler

- İstek `Authorization: Bearer <token>` başlığı göndermeli.
- HTTP cevabı başarılı değilse `TMDB isteği başarısız: <status>` mesajıyla hata fırlatılmalı.
- Başarılı cevabın JSON gövdesi fonksiyonun ilan ettiği sonuç tipi olarak dönmeli.
- Başlık eklenmesi JSON'un runtime'da doğrulandığı anlamına gelmez.

## Örnek

Test ortamında `550` için istek `test-token` ile gönderildiğinde `Dövüş Kulübü` başlıklı cevap döner. Bulunmayan kimlik için `TMDB isteği başarısız: 404` hatası oluşur.

## Sözleşme

- Dosya: `task.ts`
- Export fonksiyon: `getJson<T>(url: string, token: string): Promise<T>`.
