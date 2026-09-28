Tarayıcının performans gözlemcisinden toplanan yerleşim kayması girdilerini işleyerek sayfanın kümülatif yerleşim kayması (CLS) skorunu hesaplayan saf bir fonksiyon yaz.

## Gereksinimler

- Girdiler listesindeki her öğe bir kayma puanı (`value`) ve kullanıcının son 500 ms içinde bir etkileşimde bulunup bulunmadığını belirten bir bayrak (`hadRecentInput`) taşır.
- Kullanıcı etkileşimi kaynaklı olan (`hadRecentInput: true`) kaymalar beklenmeyen kayma sayılmaz; toplama **dahil edilmemelidir**.
- Yalnızca beklenmeyen (`hadRecentInput: false`) kaymaların `value` değerleri toplanmalıdır.
- JavaScript kayan nokta (floating point) toplama hatalarını önlemek için sonuç **4 ondalık basamağa** yuvarlanmalıdır (ör. `0.07000000000000002` yerine `0.07`).
- Girdi listesi boşsa ya da geçerli kayma yoksa sonuç `0` olmalıdır.

## Örnek

| Girdiler | Sonuç | Açıklama |
|---|---|---|
| `[{ value: 0.05, hadRecentInput: false }, { value: 0.12, hadRecentInput: true }]` | `0.05` | İkinci girdi kullanıcı etkileşimiyle oluştuğu için sayılmaz. |
| `[{ value: 0.02, hadRecentInput: false }, { value: 0.03, hadRecentInput: false }]` | `0.05` | İki beklenmeyen kaymanın toplamı. |
| `[]` | `0` | Kayma yok. |

## Sözleşme

- Dosya ve export: `calculateCls.ts` → `calculateCls(entries: LayoutShiftEntry[]): number`
- Tip tanımı:
  \`\`\`ts
  export interface LayoutShiftEntry {
    value: number
    hadRecentInput: boolean
    startTime?: number
  }
  \`\`\`
