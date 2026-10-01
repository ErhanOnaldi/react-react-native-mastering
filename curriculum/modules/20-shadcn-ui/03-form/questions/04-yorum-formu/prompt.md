Dövüş Kulübü sayfasındaki ziyaretçi yorum bırakabilsin. Yorum ve puan alanlarının etiketleri, kontrolleri ve hata mesajları her zaman doğru alana bağlı kalsın.

## Gereksinimler
- `Yorum` etiketi bir metin alanına, `Puan (1–5)` etiketi sayı alanına bağlı olsun.
- Alanların etiketleri `Yorum` ve `Puan (1–5)` olarak görünsün; gönder düğmesinin adı `Gönder` olsun.
- Form boş gönderildiğinde ilgili Türkçe hatalar görünür olsun ve kendi alanlarına açıklama olarak bağlansın.
- Hata yokken kontroller geçersiz görünmesin ve var olmayan hata açıklamasına bağlanmasın.
- Yorum ve puan geçerliyse gönderim callback'i `{ body: 'Harika film', rating: 4 }` biçiminde temizlenmiş metin ve sayı alsın.
- Sayfada iki yorum formu varsa birindeki hata diğer formun alanına bağlanmasın.

## Örnek
Boş `Gönder` → Yorum alanında `Yorum gerekli`, puan alanında `Puan seç` görünür. `Harika film` ve `4` gönder → callback temizlenmiş yorumu ve sayısal puanı alır.

## Sözleşme
- `ReviewForm.tsx` → named export `ReviewForm`.
- Props: `onSubmit: (values: ReviewValues) => void`.
- `form.tsx` ve `reviewSchema.ts` salt okunurdur; `ReviewForm` bu form parçalarını ve şemayı kullanır.
