Dövüş Kulübü için yorum yaz.

- Boş yorumda “Yorum gerekli” göster ve istek atma.
- Geçerli metni `POST https://dummyjson.com/comments/add` adresine JSON `{ body, postId, userId: 1 }` olarak gönder. `postId` prop'u varsayılan 550.
- Başarılı 201 yanıtında “Yorum kaydedildi” göster ve alanı boşalt.
- HTTP hatasında "Yorum gönderilemedi" mesajını göster; yazılan metin kalsın.
- İstek sürerken buton kapalı olsun.

Sahte API boş `body` için 400 verir; testler `requests('/comments/add')` ile isteği sayar.
