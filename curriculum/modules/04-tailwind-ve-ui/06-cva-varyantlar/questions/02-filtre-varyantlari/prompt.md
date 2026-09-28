Filtre sekmesi seçili ton ve boyuta göre class üretmeli. Varsayılan görünüm açık/pasif ve normal boy olsun; küçük seçili görünüm ek vurgu taşısın.

## Gereksinimler
- Temel class `rounded-lg` her çıktıda bulunsun.
- `selected`: `bg-sky-700 text-white`; `plain`: `bg-slate-100 text-slate-900`.
- `sm`: `px-2 py-1`; `md`: `px-4 py-2`.
- Varsayılanlar `plain` ve `md` olsun.
- Yalnız `selected` + `sm` birleşiminde `font-bold` eklensin.

## Örnek
Argümansız çağrı `plain`/`md` görünümünü; `selected` + `sm` küçük padding ve kalın vurgu verir.

## Sözleşme
- Dosya ve export: `filterVariants.ts` → `filterVariants({ tone?, size? })` class string'i üretir.
- `FilterVariantProps` adıyla props tipi export edilir.
