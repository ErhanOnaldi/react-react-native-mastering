Yükleme sırasında yer tutucu alanı koru; arama alanı da doğal input davranışını ve erişilebilir adını desteklesin.

## Gereksinimler
- `Skeleton` bir `<div aria-hidden="true">` olsun; class'ları `animate-pulse rounded-lg bg-slate-200` taşısın.
- Skeleton native div props'larını ve class override'ını iletsin.
- `Input` native input props'larını iletsin; class'ları `rounded-lg border px-3 py-2 focus-visible:outline-2` olsun.
- Kullanım yeri input'a erişilebilir ad verebilsin.
- Dış class padding çakışmasını override edebilsin.

## Örnek
`aria-label="Albüm ara"` ve `placeholder="Başlık"` ile verilen Input erişilebilir `textbox` olur; `px-6` verilirse `px-3` kalmaz.

## Sözleşme
- Dosya ve export: `LoadingFields.tsx` → `Skeleton` (`div`) ve `Input` (`input`).
- Her iki bileşen native element props'larını, `className` dahil, kabul eder.
- Önizlemede yer tutucuyu ve erişilebilir Input'u görürsün.
