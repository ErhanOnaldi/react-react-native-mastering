Yorum başlığı ve metni tek tek dolu olsa bile ikisi birlikte çok kısaysa gönderimi engelle. Sunucu geçici olarak hata verdiğinde kullanıcının yazısı korunsun ve yeniden deneme mümkün olsun.

## Gereksinimler
- `Başlık` ve `Yorum` alanları ayrı ayrı boş bırakılamasın.
- İki alanın toplam uzunluğu 15 karakterden azsa `alert` içinde birlikte olduklarını belirten anlaşılır hata gösterilsin; istek atılmasın.
- Sunucu gönderimi reddederse hata `alert` içinde `gönderilemedi` kelimesini içersin ve alanlardaki değerler korunsun.
- Sonraki başarılı gönderimde `status` içinde `gönderildi` kelimesini içeren mesaj gösterilsin.

## Örnek
`Ok` başlığı ve `iyi` metni gönderilmeden reddedilir. Yeterince uzun içerik sunucuda ilk denemede reddedilirse içerik kalır; tekrar gönderip başarı alınca başarı mesajı görünür.

## Sözleşme
- `ReviewPanel.tsx` → named export `ReviewPanel`.
- Alan adları `Başlık`, `Yorum`; gönder düğmesinin adı `Gönder`.
- Sunucu uç noktası DummyJSON `POST /comments/add`.
