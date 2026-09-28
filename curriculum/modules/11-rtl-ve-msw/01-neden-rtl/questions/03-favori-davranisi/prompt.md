Favori kontrolünün kullanıcı tarafından gerçekten çalıştırıldığını ve doğru filmi taşıdığını doğrulayan testler yaz.

## Gereksinimler
- Başlangıçta “Favorilere ekle” adlı düğme görünür.
- Düğmeye tıklanınca callback `550` ile çağrılır.
- Favori durumunda düğmenin adı “Favorilerden çıkar” olur.

## Örnek
`movieId=550` olan film → “Favorilere ekle” düğmesine tıkla → callback `550` alır.

## Sözleşme
- `FavoriteButton.test.tsx` dosyasına test yaz.
- Bileşen: `@impl/FavoriteButton`, props: `movieId`, `isFavorite`, `onToggle`.
- Callback türü `(movieId: number) => void`.
- Testler rol/ad/metin üzerinden görünen kontrolü doğrulamalı.

## Kısıtlar
- CSS class’ı test etme.
- Verilen mutantların her birini en az bir test yakalamalıdır.
