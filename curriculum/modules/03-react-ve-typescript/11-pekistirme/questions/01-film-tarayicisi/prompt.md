Sinema'nın statik film arayüzünde arama ve favori birlikte çalışmalı. Arama bir filmi geçici olarak gizlediğinde favori seçimi korunmalıdır.

## Gereksinimler

- Üç film (550 Dövüş Kulübü, 155 Kara Şövalye, 603 Matrix) başlangıçta görünmelidir.
- “Film ara” alanı başlığa göre büyük/küçük harfe duyarsız filtrelemelidir.
- Filmler liste öğelerinde gösterilmelidir.
- Her film için erişilebilir adı `[BAŞLIK] Favoriye ekle` veya `[BAŞLIK] Favoriden çıkar` olan bir button görünmelidir.
- `aria-pressed` film başına favori durumunu yansıtmalıdır.
- Filtrelenip geri gelen film favori işaretini korumalıdır.
- Eşleşme yokken “Film bulunamadı” görünmelidir.

## Örnek

Matrix'i favorile → “Kara” ara → alanı temizle → Matrix'in düğmesi hâlâ basılıdır.

## Sözleşme

- Dosya ve export: `MovieBrowser.tsx` → named export `MovieBrowser`
- Props: yok; statik film listesi başlangıç kodunda sağlanır.
- Arayüz: “Film ara” textbox'ı, film `listitem`'ları ve favori düğmeleri.
