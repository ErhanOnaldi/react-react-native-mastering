Arama alanında gösterilen metin parent'tan gelir; kullanıcı yeni değer yazdığında üst bileşene bildirilmelidir.

## Gereksinimler

- Alanın erişilebilir adı “Film ara” olmalıdır.
- `value` prop'u input'ta görünmelidir.
- Kullanıcı yazdığında callback yeni metinle çağrılmalıdır.

## Örnek

`value="Kara"` → input'ta “Kara”; boş alana “M” yaz → callback “M” değeriyle çağrılır.

## Sözleşme

- Dosya ve export: `SearchField.tsx` → named export `SearchField`
- Props: `{ value: string; onChange: (value: string) => void }`
- Arayüz: “Film ara” adını taşıyan textbox.
