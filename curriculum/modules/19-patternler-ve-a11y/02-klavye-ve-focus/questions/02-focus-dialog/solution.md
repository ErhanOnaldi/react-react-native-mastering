## Neden böyle?
Dialog açılınca focus'u içeri taşımak klavye kullanıcısına penceredeki ilk eylemi verir. Trap yalnızca **sınırlarda** Tab'ı durdurur; aradaki hareketi tarayıcının doğal sırası yapar. Kapanırken `isConnected` kontrolü, açan öğe bu arada sayfadan kalktıysa hatayı önler.

`onClose`'u `useEffectEvent` ile sardık. Effect artık yalnızca `open`'a bağlı: üst bileşen yeni bir `onClose` üretse de dinleyici yeniden kurulmuyor, cleanup focus'u erken geri taşımıyor. Escape ise her zaman en güncel `onClose`'u çağırıyor (son test bunu doğruluyor).

### Alternatifler
- Üst bileşende `onClose`'u `useCallback` ile sabitlemek de işe yarar, ama bu, bileşenin doğru çalışmasını **kullananın** dikkatine bırakır. Bileşen kendini korumalı.
- Güncel `onClose`'u bir ref'te tutmak (`latestOnClose.current = onClose`) `useEffectEvent`'ten önceki yaygın çözümdü; eski kodda görürsün.

### Sık hata
`[open, onClose]` bağımlılığı "lint'i susturmak için" doğru görünür, ama önizlemedeki saniye sayacı gibi sıradan bir render focus'u zıplatır. Bu, effect'in neyi senkronize ettiğini (açık dialog) ve neyin sadece bir olay olduğunu (kapatma isteği) ayırmanın pratik sonucudur.

### Sıradaki adım
Dialog şimdilik kartın içinde render oluyor; kartın `overflow: hidden` sınırında kesilebilir. Sonraki derste portal ile DOM yerini taşıyacaksın.
