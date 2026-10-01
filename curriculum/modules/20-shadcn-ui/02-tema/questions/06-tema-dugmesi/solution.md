## Neden böyle?

Tema rengi CSS token'larından gelir; geçiş için uygulama köküne `.dark` sınıfını ekleyip kaldırmak yeterlidir. Düğmenin adı ve `aria-pressed` değeri de aynı state'ten üretildiği için ekranda görünen metin, erişilebilir durum ve tema sınıfı birlikte değişir.

Sınıfı `document.documentElement` üzerine koyuyoruz. Dialog gibi portal içerikleri de bu öğenin altında olduğundan aynı açık/koyu CSS değişkenlerini devralır.

`classList.toggle('dark', nextDark)` açık bir boolean kullanır; her tıklamada sınıfı tersine çevirmek yerine React state'inin seçtiği değere eşitler.
