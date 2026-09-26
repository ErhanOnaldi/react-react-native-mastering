Özet/Oyuncular/Videolar sekmeleri fareyle çalışıyor ama Tab her sekmeye ayrı duruyor. Şimdi aynı compound API'ye gerçek tab klavye düzeni ekle.

## Gereksinimler
- `KeyboardTabs` statik `List`, `Trigger`, `Panel` parçalarını sunsun; kök `defaultValue` alsın.
- Tab listesi `aria-label` alsın. Yalnızca seçili Trigger `tabIndex=0`; diğerleri `-1` olsun.
- ArrowRight/ArrowLeft komşu sekmeye döngülü geçsin; Home ilk, End son sekmeye gitsin. Hem seçim hem focus değişsin.
- Trigger `aria-controls` ile kendi panelini, panel `aria-labelledby` ile Trigger'ı işaret etsin. Kimlikleri `useId` ile oluştur.
- Seçilmeyen panel DOM'da kalabilir ama `hidden` olmalı.

Önizlemede önce Tab ile seçili sekmeye gel, sonra ok tuşlarıyla dolaş.
