## Neden böyle?

`response.ok` kontrolü 400’ü sessiz başarı saymayı engeller. Hata mesajını API yanıtından okumak formun kullanıcıya anlaşılır geri bildirim vermesini sağlar. `decodeJwtPayload` yalnız gözlem içindir; payload’a bakarak kullanıcıya yetki vermek yanlış olur, çünkü imzayı doğrulamıyoruz.

Alternatif olarak sunucudan gelen yanıtı Zod ile doğrulayabilirsin. Burada odak istek ve JWT biçimi. Sonraki görev bu isteği RHF formuna bağlayacak; ileride refresh sırasında `exp` ve 401 birlikte ele alınacak.
