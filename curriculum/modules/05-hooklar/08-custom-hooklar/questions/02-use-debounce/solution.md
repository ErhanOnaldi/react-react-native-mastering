Timer bir dış sistemdir; effect ve cleanup burada ağ isteği dışında yeniden kullanıldı. Timer temizlenmezse hızlı yazmada eski değerler sırayla state’e gelir. Testte gerçek süre beklemek yerine `vi.useFakeTimers()` zamanı denetler.

## Alternatif ve tuzak

Eski timer temizlenmezse her ara değer sırayla görünür; bu debounce değil gecikmiş kuyruktur. Fake timers süreyi deterministik sınar.

## Sektörde ve sonra

Proje aramasında bu hook yazma ile TMDB isteğini ayıracak.
