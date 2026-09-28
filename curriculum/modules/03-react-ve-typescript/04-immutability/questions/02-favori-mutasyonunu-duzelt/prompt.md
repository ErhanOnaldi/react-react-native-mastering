Önizlemede bir filmi favoriye ekleyip çıkarırken karttaki durum güncellenmeli. Bir filmi değiştirmek diğer filmin seçimini etkilememeli.

## Gereksinimler

- 550 ve 155 kimlikli iki film başlığı görünmelidir.
- Her film için düğme adı başlık ile “Favoriye ekle” veya “Favoriden çıkar” eyleminden oluşmalıdır.
- `aria-pressed` favori durumunu yansıtmalıdır.
- Düğmeye iki kez basınca o film önce eklenip sonra çıkarılmalıdır.
- İki filmi ayrı ayrı seçip birini çıkarınca diğerinin seçimi korunmalıdır.

## Örnek

Dövüş Kulübü'nü favoriye ekle → `aria-pressed="true"`; aynı düğmeye yeniden bas → `false`.

## Sözleşme

- Dosya ve export: `FavoriteShelf.tsx` → named export `FavoriteShelf`
- Props: yok
- Arayüz: film başlıkları ve film başlığı + eylem adını taşıyan button'lar.

## Kısıtlar

- Önizlemede görülen iki film dışında ağ isteği gerekmez.
