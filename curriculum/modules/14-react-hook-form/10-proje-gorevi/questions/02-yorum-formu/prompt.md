Sinema'ya yorum formu ekle. `src/features/watchlists/ReviewForm.tsx` dosyasından named export `ReviewForm({ postId }: { postId: number })` olsun.

- Formda `body: string` ve `rating: number` değerleri olsun. Puan kontrolü 1–5 arasındaki yıldız düğmelerini göstersin; her düğmenin erişilebilir adı “N yıldız” olsun ve seçili düğme `aria-pressed="true"` taşısın.
- Puan seçilmediyse “Puan seç”, yorum boşsa “Yorum gerekli” hatalarını göster. Label ve hata ilişkilerini kur.
- Geçerli yorumda `POST https://dummyjson.com/comments/add` gönder. JSON gövdesi `{ body, postId, userId: 1 }` olsun. Puanı bu endpoint'e gönderme; UI form değerinde tut.
- İstek sürerken gönderim düğmesini kapat. 201 sonrası “Yorum kaydedildi” mesajı göster; HTTP hatasında hata mesajı göster. Başarıda metni temizleyebilirsin.

Sinema uygulamasının mevcut `QueryClientProvider` yapısını kullan. Testler bu bileşeni taze bir provider ile render eder.
