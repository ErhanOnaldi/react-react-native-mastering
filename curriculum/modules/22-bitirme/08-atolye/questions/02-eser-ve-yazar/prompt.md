Kitaplık eser detay ekranında bir kitaptan diğerine geçildiğinde kitap başlığı güncellenmesine rağmen yazar bilgisi önceki eserde takılı kalmaktadır. Eser kimliği değiştikçe yazar bilgisinin de senkronize olarak doğru esere ait güncellenmesi ve bulunamayan durumlarda belirtilen mesajın gösterilmesi gerekiyor.

## Gereksinimler

- Adres çubuğundaki eser kimliği (`workId`) değiştikçe ekrandaki başlık ve yazar bilgisi yeni esere göre güncellenmelidir.
- Yazar bilgisi mevcut değilse veya yazar isteği başarısız olursa ekranda tam olarak **“Yazar: Yazar bulunamadı”** ifadesi yer almalıdır.
- Tarayıcı geçmişinde geri veya ileri gidildiğinde o esere ait doğru yazar bilgisi ekranda görünmelidir.

## Örnek

Kullanıcı `/books/OL893414W` adresine gider:
- Ekranda "Dune" ve "Yazar: Frank Herbert" görünür.
- Kullanıcı `/books/OL24252290W` adresine geçer:
- Ekranda "Suç ve Ceza" ve "Yazar: Yazar bulunamadı" görünür.
- Tarayıcıda geri tuşuna basar:
- Yeniden "Dune" ve "Yazar: Frank Herbert" belirir.

## Sözleşme

- Dosya ve dışa aktarma: `BookDetail.tsx` → `export function BookDetail(): React.JSX.Element`
- Arayüz metinleri:
  - Yazar gösterim şablonu: `Yazar: {yazarAdı}`
  - Bulunamayan/eksik yazar metni: `Yazar: Yazar bulunamadı`

## Kısıtlar

- Yazar bilgisi önceki eserin state veya önbellek kalıntısını taşımamalı; aktif eserin kimliğine ve yazar anahtarına sıkı sıkıya bağlı olmalıdır.
