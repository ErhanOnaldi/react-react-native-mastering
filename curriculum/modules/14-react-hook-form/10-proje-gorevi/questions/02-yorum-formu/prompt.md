Sinema'da filme puan ve yorum metni ekleyen form oluştur. Alan hatalarını ve kayıt durumunu kullanıcıya açıkça göster.

## Gereksinimler

- Puan seçimi 1–5 arasındaki yıldız düğmeleriyle çalışsın; her düğmenin erişilebilir adı “N yıldız”, seçilinin `aria-pressed="true"` olsun.
- Yorum textarea'sı ve puan seçimi tek form verisinde bulunsun. İki alana da görünür label veya uygun erişilebilir ad ver.
- Puan yoksa “Puan seç”, metin boşsa “Yorum gerekli” alan hatalarını göster; her hata ilgili alanla ilişkilendirilsin.
- Geçerli gönderimde `POST https://dummyjson.com/comments/add` adresine JSON `{ body, postId, userId: 1 }` gönder. `postId` bileşen prop'undan gelsin.
- `rating` UI form değerinde kalsın ve JSON gövdesine eklenmesin.
- İstek sürerken gönderim düğmesini devre dışı bırak; başarıda “Yorum kaydedildi”, HTTP hatasında görünür hata göster.

## Örnek

`postId: 550`, 4 yıldız ve `Dövüş Kulübü harika` → `{ body: 'Dövüş Kulübü harika', postId: 550, userId: 1 }`.

## Sözleşme

- Dosya: `src/features/watchlists/ReviewForm.tsx`.
- Export: `ReviewForm({ postId }: { postId: number })` named export.
- Bileşen mevcut `QueryClientProvider` altında çalışmalıdır.
- Arayüz: “1 yıldız”–“5 yıldız”, “Yorum” ve “Gönder”; alan hataları `role="alert"` ve doğru `aria-describedby` ilişkisiyle bulunabilsin.

## Kısıtlar

- Yorum isteğine puan alanını ekleme; endpoint yalnız yorum metni, film kimliği ve sabit kullanıcı kimliğini alır.
