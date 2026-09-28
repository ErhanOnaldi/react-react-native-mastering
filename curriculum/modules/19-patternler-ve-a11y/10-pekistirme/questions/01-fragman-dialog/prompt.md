Fragman penceresi açılınca arka plana tıklamak kapatmalı; pencerenin başlığına tıklamak açık bırakmalı. Açma, klavye dolaşımı ve kapanış focus'u tek akışta tamamla.

## Gereksinimler

- `Fragmanı aç` adlı button dialogu açar; dialog kapalıyken DOM'da bulunmaz.
- Açık dialog `role="dialog"`, `aria-modal="true"` ve `{movieTitle} fragmanı` adı taşır.
- Tam ekran arka plan `document.body` altında olur; dialog onun doğrudan çocuğudur.
- Dialogda `Oynat` ve `Kapat` düğmeleri bulunur; açılışta Oynat focus alır.
- Tab ve Shift+Tab focus'u dialog içinde döndürür.
- Escape, Kapat ve arka plan click'i dialogu kapatıp focus'u açan düğmeye verir.
- Başlığa veya dialog içeriğine click yapmak dialogu kapatmaz.

## Örnek

`movieTitle="Yıldızlararası"` için dialogun erişilebilir adı `Yıldızlararası fragmanı` olur. Başlığa tıklamak pencereyi açık bırakır; arka planın boş alanına tıklamak kapatır.

## Sözleşme

- `TrailerDialog.tsx` içinden named export `TrailerDialog({ movieTitle })`.
- `movieTitle: string`; tetikleyici adı `Fragmanı aç`.
