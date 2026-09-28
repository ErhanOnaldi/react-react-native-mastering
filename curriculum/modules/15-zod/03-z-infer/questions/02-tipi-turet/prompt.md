İzleme listesi oluşturulurken ad ve görünürlük aynı veri sözleşmesine uysun.

## Gereksinimler
- name başındaki ve sonundaki boşluklardan arındırılsın ve en az bir karakter içersin.
- isPublic boolean olmalı.
- Eksik veya geçersiz alanlar parse sırasında reddedilsin.

## Örnek
{ name: "  Klasikler  ", isPublic: true } girdisinin adı Klasikler olur; yalnız boşluk içeren ad reddedilir.

## Sözleşme
- watchlist.ts dosyasında watchlistSchema, WatchlistValues tipi ve createWatchlist(raw: unknown): WatchlistValues named export'larını tanımla.
- WatchlistValues tipi watchlistSchema'dan türetilmiş olmalı.

