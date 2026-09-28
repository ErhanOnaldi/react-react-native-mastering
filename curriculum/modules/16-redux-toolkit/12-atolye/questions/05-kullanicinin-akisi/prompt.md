Kullanıcı, gönderi ve yorumları birbirine bağlayan bir akış ekranı kur. Kullanıcı ve gönderi seçimi bağlantı olarak açılabilmeli; boş veya hatalı kaynakta ekran anlaşılır kalmalı.

## Gereksinimler

- DummyJSON kullanıcıları listelenir; seçilen kullanıcının gönderileri gösterilir.
- Bir gönderi seçildiğinde o gönderinin yorumları gösterilir.
- Gönderisiz kullanıcı ve yorumsuz gönderi için anlamlı boş durum görünür.
- Her kaynak için yükleme ve hata durumları okunabilir olmalıdır.
- Kullanıcı ve gönderi URL’den doğrudan açılabilir.
- Uygulama içinde kullanıcı akışı ekranına gidilebilmelidir.

## Örnek

Bir kullanıcıyı seç → gönderileri gör → bir gönderiyi aç → yorumları gör. Aynı URL doğrudan açıldığında aynı kullanıcı ve gönderi görünmelidir.

## Sözleşme

- Proje dosyaları: `projects/atolye/src/kullanicinin-akisi/`
- Uygulama ekranı kullanıcı ve gönderi adreslerini doğrudan yükler.
- Veri kaynakları DummyJSON `/users`, `/posts` ve `/comments`’tır.
