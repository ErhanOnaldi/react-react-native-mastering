Arama alanı dışarıdan aldığı metni göstermeli ve her değişen değeri `onValueChange` callback'ine bildirmeli.

## Gereksinimler

- `value` prop'u textbox'ta görünmelidir.
- Kullanıcı yazınca güncel metin `onValueChange` ile iletilmelidir.
- Alanın erişilebilir adı “Film ara” olmalıdır.

## Sözleşme

- Dosya ve export: `SearchField.tsx` → named export `SearchField`
- Props: `{ value: string; onValueChange: (value: string) => void }`
