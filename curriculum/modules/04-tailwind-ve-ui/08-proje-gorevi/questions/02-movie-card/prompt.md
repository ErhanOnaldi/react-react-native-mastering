UI kit artık hazır ama gerçek film kartı eski kopya class'ları kullanıyor.

- `src/components/MovieCard.tsx` içindeki `MovieCard({ movie, isFavorite, onToggleFavorite })` API'sini koru. Kök kart için `Card`, puan için `Badge`, favori işlemi için `Button` kullan. Favori düğmesinin erişilebilir adı aktifken "Favorilerden çıkar", değilken "Favoriye ekle" olsun; `aria-pressed={isFavorite}` ile durumunu bildir. Tıklamada önceki gibi o filmin favori durumunu değiştir. Poster yoksa kart çökmesin.
- `src/components/SearchBox.tsx` içinde mevcut controlled `SearchBox({ value, onChange })` API'sini koruyarak doğal `<input>` yerine `src/components/ui/input.tsx` içindeki `Input`'u kullan. Erişilebilir adı "Film ara" olsun.
- `src/components/MovieGrid.tsx` ve `src/App.tsx` içindeki filtreleme/favori akışını koru. Gerekirse responsive grid class'larını iyileştir.

Sinema'yı açıp bir filmi favoriye ekle, arama metniyle listeyi daralt, favoriyi kaldır. Görünümü açık ve koyu temada kontrol et. Testler tıklama ve erişilebilir durum sözleşmesini sınar; kartın tam renk/piksel düzenini seçmek sana kalır.
