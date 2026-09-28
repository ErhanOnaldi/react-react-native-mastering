Bir film seçicisi film seçimini görünür sıra değişse de aynı kayıtla ilişkilendirmeli.

## Gereksinimler

- Başlangıçta Dövüş Kulübü, Kara Şövalye ve Matrix film satırları görünmelidir.
- Her satır `BAŞLIK seç` adlı bir button içermelidir.
- Seçilen filmin `aria-pressed` değeri `true`, diğerlerininki `false` olmalıdır.
- “Sırayı ters çevir” düğmesi görünür film sırasını tersine çevirmelidir.
- Sıralama değişiminden sonra seçim aynı filmde kalmalıdır.

## Örnek

Dövüş Kulübü'nü seç → sırayı ters çevir → ilk satır Matrix olur, seçili film hâlâ Dövüş Kulübü'dür.

## Sözleşme

- Dosya ve export: `MoviePicker.tsx` → named export `MoviePicker`
- Props: yok; başlangıç film listesi bileşende sağlanır.
- Arayüz: film seçim button'ları ve “Sırayı ters çevir” button'ı.
