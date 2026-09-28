Arama alanı üst bileşenden gelen sorguyu göstermeli ve kullanıcının yeni yazısını üst bileşene iletmeli.

## Gereksinimler

- Alanın erişilebilir adı “Film ara” olmalıdır.
- `value` prop'u alanın görünen değerini belirlemelidir.
- Kullanıcı yazdığında callback yeni string değerle çağrılmalıdır.
- Yeni `value` prop'u geldiğinde alan yeni değeri göstermelidir.

## Örnek

`value="Kara"` → alan “Kara” gösterir; üst bileşen `value="Matrix"` gönderince alan “Matrix” olur.

## Sözleşme

- Dosya ve export: `SearchBox.tsx` → named export `SearchBox`
- Props: `{ value: string; onChange: (value: string) => void }`
- Arayüz: “Film ara” adını taşıyan textbox.
