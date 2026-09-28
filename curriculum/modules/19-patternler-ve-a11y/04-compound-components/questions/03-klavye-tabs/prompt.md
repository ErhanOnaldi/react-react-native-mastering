Sekmeler fareyle çalışıyor, ancak Tab her sekmede ayrı duruyor ve panel ilişkisi ekran okuyucuya açıklanmıyor. Aynı sekme grubuna klavye dolaşımı ve programatik ilişkiler ekle.

## Gereksinimler

- Yalnız seçili sekme Tab sırasına girsin (`tabIndex=0`); diğer sekmeler `-1` olsun.
- ArrowRight/ArrowLeft görünen sekmelerde döngü yapsın; Home ilk, End son sekmeye gitsin. Focus ve seçim birlikte değişsin.
- Her Trigger `aria-controls` ile kendi panelini; panel `aria-labelledby` ile Trigger'ını işaret etsin.
- Birden fazla grup kullanıldığında id'ler çakışmasın.
- Seçili olmayan panel DOM'da kalsın ama görünmez olsun.

## Örnek

Üç sekmeli bir listede Özet seçiliyken Tab ile gruba bir kez girilir. ArrowLeft son sekme olan Videolar'a gider; End de Videolar'ı seçer.

## Sözleşme

- `KeyboardTabs.tsx` içinden named export `KeyboardTabs`.
- `KeyboardTabs.List` → `tablist`; `KeyboardTabs.Trigger({ value })` → `tab`; `KeyboardTabs.Panel({ value })` → `tabpanel`.
- `List` `aria-label` alır; kök `defaultValue` alır.
