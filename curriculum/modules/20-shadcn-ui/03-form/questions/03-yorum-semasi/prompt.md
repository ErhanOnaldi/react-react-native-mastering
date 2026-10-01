Yorum gönderilmeden önce alanları doğrula ve kullanıcıya her durumda Türkçe, açık bir mesaj göster. Geçerli metni temizlenmiş halde dışarı ver.

## Gereksinimler
- `body` baştaki ve sondaki boşluklardan arındırılsın, boş kaldığında `Yorum gerekli` mesajıyla reddedilsin ve 500 karakteri aşmasın.
- `rating` zorunlu, sayı ve tam sayı olsun; 1–5 aralığının dışı reddedilsin.
- Mesajlar: yanlış/yok rating `Puan seç`; kesirli rating `Puan tam sayı olmalı`; aralık dışı rating `Puan 1 ile 5 arasında olmalı`; 500'den uzun body `Yorum en fazla 500 karakter olabilir`.
- Geçerli girdi temizlenmiş `body` ve sayısal `rating` döndürsün.

## Örnek
`{ body: '  Harika  ', rating: 4 }` → `{ body: 'Harika', rating: 4 }`.

## Sözleşme
- `reviewSchema.ts` → `reviewSchema` ve bundan türetilmiş `ReviewValues` export'ları.
- Şema `safeParse` ve `parse` ile kullanılabilir olmalı.
