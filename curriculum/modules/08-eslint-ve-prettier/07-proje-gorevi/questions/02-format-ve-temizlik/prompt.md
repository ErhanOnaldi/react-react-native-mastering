# Sinema format ve lint temizliği

Sinema’da bütün geliştiricilerin aynı biçimi kullanmasını sağla. Lint hataları kaynak kodda çözülmeli; film arama, TMDB ve gezinme davranışı korunmalı.

## Gereksinimler

- String’lerde tek tırnak ve noktalı virgülsüz biçim kullan.
- Tailwind class’ları sırala ve Tailwind v4 stylesheet yolu `./src/index.css` olsun.
- `.prettierignore` içinde `dist` ve `coverage` dışlansın.
- `lint`, `format`, `format:check` script’leri sırasıyla `eslint .`, `prettier --write .`, `prettier --check .` çalıştırsın.
- `src` altındaki TS/TSX dosyalarında lint hatası kalmasın; detay sayfasında eksik film kimliği bağımlılığı bulunmasın.
- Biçimleme ve lint düzeltmeleri uygulamanın mevcut davranışını korusun.

## Örnek

`const title = "Dövüş Kulübü";` → ortak biçimden sonra `const title = 'Dövüş Kulübü'` olur. CI biçim farkı bulursa dosya değişmez, komut başarısız olur.

## Sözleşme

- Proje: `sinema`; proje kökünde `.prettierrc.json`, `.prettierignore` ve güncellenmiş `package.json` bulunmalıdır.
- Tailwind kaynağı: `src/index.css`.

## Kısıtlar

- Mevcut `package.json` script’lerini silme; gereken paketleri yalnızca eksikse ekle.
- Kontrol komutu dosya yazmamalıdır.
