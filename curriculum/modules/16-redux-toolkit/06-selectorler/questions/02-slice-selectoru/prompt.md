Arayüz, uygulamanın mevcut tema değerinin koyu olup olmadığını boolean olarak okuyabilmeli.

## Gereksinimler

- Açık tema için selector `false`, koyu tema için `true` döndürür.
- `dialogOpen` alanındaki değişiklik sonucu etkilemez.

## Örnek

`theme: "light", dialogOpen: true → false`; `theme: "dark", dialogOpen: false → true`.

## Sözleşme

- Dosya: `ui.ts`
- Export: `uiSlice`, `setTheme(theme: "light" | "dark")`, `selectIsDark`
- Selector kök state biçimi: `{ ui: { theme: "light" | "dark"; dialogOpen: boolean } }`
