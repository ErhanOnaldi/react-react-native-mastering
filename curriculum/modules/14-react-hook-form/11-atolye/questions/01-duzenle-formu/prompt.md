İzleme listesi kartı, seçilen listenin adını ve açıklamasını düzenlenebilir alanlarda gösterir.

`WatchlistEditor.tsx` içindeki `WatchlistEditor` bileşenini tamamla:

- `list` prop'u değişince alanlar **yeni** listenin adını ve açıklamasını göstermeli — önceki listeden kalan yazı görünmemeli.
- Kullanıcı hiçbir alanı değiştirmeden `Kaydet`'e basarsa `onSave` çağrılmamalı.
- Bir alan değiştirilip `Kaydet`'e basılınca `onSave`, güncel `{ name, description }` değeriyle çağrılmalı.

Önizlemede birkaç listeyi arka arkaya aç; formun her seferinde doğru listeyi gösterdiğini gözle de doğrula.
