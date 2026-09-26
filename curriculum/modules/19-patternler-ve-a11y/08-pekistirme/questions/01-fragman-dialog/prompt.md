Fragman dialogunu kartın dışına (portal) taşıdın, focus akışını kurdun. Tasarım ekibi bir şey daha istiyor: **karartılmış arka plana tıklayınca** dialog kapansın. İlk denemede dialogun içine tıklamak da kapatıyor.

## Gereksinimler
- `TrailerDialog({ movieTitle })` kendi aç/kapat state'ini tutsun; tetikleyici **Fragmanı aç** adlı bir `<button>` olsun.
- Açıkken `role="dialog"`, `aria-modal="true"` ve adı **{movieTitle} fragmanı** olan bir dialog göster.
- Dialog, tam ekran bir **arka plan** öğesinin doğrudan çocuğu olsun; arka plan `createPortal` ile `document.body` altına render edilsin.
- İçinde **Oynat** ve **Kapat** düğmeleri olsun; açılışta Oynat focus alsın.
- Tab ve Shift+Tab dialog içinde dönsün.
- Escape, Kapat ve **arka plana tıklama** dialogu kapatsın; her üç yolda da focus Fragmanı aç'a dönsün.
- **Dialogun içine** (başlık, boşluk) tıklamak dialogu kapatmasın.

Önizlemede önce klavyeyle (Tab, Enter, Tab, Escape), sonra fareyle (arka plana ve başlığa tıklama) dene.
