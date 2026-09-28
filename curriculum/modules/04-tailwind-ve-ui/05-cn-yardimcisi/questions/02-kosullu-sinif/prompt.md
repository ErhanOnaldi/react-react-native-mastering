Filtre sekmelerinin aktiflik ve yoğunluk görünümü koşullu olarak değişsin; her durumda ortak sınıflar korunsun ve tek class string döndürülsün.

## Gereksinimler
- Her durumda `rounded-lg` class'ı bulunsun.
- Aktif görünümde `bg-sky-700 text-white`, pasif görünümde `bg-slate-100 text-slate-900` kullanılsın.
- Compact görünüm `px-2 py-1`; normal görünüm `px-4 py-2` taşısın.
- Yanlış durumun class'ları eklenmesin.

## Örnek
`filterClass(true, true)` aktif küçük class'ları; `filterClass(false, false)` pasif normal class'ları verir.

## Sözleşme
- Dosya ve export: `filterClass.ts` → `filterClass(active: boolean, compact: boolean): string`.
