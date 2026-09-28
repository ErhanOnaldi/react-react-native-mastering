Seans aramasında Enter veya düğmeyle gönderilen sorgu üst bileşene iletilmeli; sayfa yenilenmemelidir.

## Gereksinimler

- “Film ara” adıyla bir textbox bulunmalıdır.
- “Ara” adlı submit düğmesi bulunmalıdır.
- Gönderilen sorgunun başındaki ve sonundaki boşluklar kaldırılmalıdır.
- Boş veya yalnız boşluktan oluşan sorgu için callback çağrılmamalıdır.
- Enter ile gönderim desteklenmelidir.

## Örnek

`"  Matrix  "` yazıp Enter → callback `"Matrix"` ile çağrılır. Yalnız boşluk gönderimi → callback çağrılmaz.

## Sözleşme

- Dosya ve export: `SearchForm.tsx` → named export `SearchForm`
- Props: `{ onSearch: (query: string) => void }`
- Arayüz: “Film ara” textbox'ı ve “Ara” adlı submit button.
