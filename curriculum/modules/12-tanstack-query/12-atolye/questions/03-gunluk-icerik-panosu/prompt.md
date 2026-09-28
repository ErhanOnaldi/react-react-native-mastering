Gerçek gönderi ve yazar verileriyle günlük içerik panosu oluştur; detaydan listeye dönüşte arama seçimini koru.

## Gereksinimler

- Gönderileri listele ve arama ifadesine göre sonucu güncelle.
- Bir gönderi açıldığında içeriğini ve doğru yazarın adını göster.
- Detaydan listeye dönünce arama ifadesi ve sonuçlar korunsun.
- Gönderi ve yazar verisi beklerken, boşken ve hata aldığında durum anlaşılır olsun.
- Pano uygulamanın içinden açılabilir olsun.

## Örnek

`posts` listesinden `userId=7` olan gönderiyi aç → gönderi içeriği ve `/users/7` cevabındaki yazar adı görünür; listeye dön → önceki arama hâlâ seçili.

## Sözleşme

- Çalışmayı `src/gunluk-icerik-panosu/` altında oluştur ve uygulama içinden panoya erişim ver.
- Veriler DummyJSON `/posts` ve `/users` adreslerinden alınır.
