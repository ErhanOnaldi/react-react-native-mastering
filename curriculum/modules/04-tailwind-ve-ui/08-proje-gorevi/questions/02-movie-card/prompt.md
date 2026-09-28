UI kit hazır, ancak film kartları ve arama alanı hâlâ kendi görsel parçalarını kullanıyor. Var olan ürün akışını koruyarak bu ekranları ortak bileşenlerle güncelle.

## Gereksinimler
- `MovieCard` kart çerçevesi, puan ve favori kontrolü için UI kit bileşenlerini kullansın.
- Film başlığı ve puanı görünür olsun.
- Favori düğmesinin adı pasifken `Favoriye ekle`, aktifken `Favorilerden çıkar` olsun; seçili durumu `aria-pressed` ile bildirilsin.
- Favori düğmesi Button'ın `ghost` görünümünü kullansın.
- Tıklama ilgili film kimliğini mevcut callback'e iletsin. Poster bulunmadığında kart çalışmaya devam etsin.
- `SearchBox` controlled değer ve değişim callback'ini korusun; erişilebilir adı `Film ara` olsun.
- Grid, arama ve favori akışları çalışmaya devam etsin.

## Örnek
Favori olmayan `Dövüş Kulübü` kartında `Favoriye ekle` düğmesi görünür. Tıklama callback'e `550` kimliğini verir. Arama alanı mevcut değeri gösterir ve yazma callback'i çağırır.

## Sözleşme
- `src/components/MovieCard.tsx` → `MovieCard({ movie, isFavorite, onToggleFavorite })`.
- `src/components/SearchBox.tsx` → `SearchBox({ value, onChange })`.
- Kullanılan kit export'ları: `Card`, `Badge`, `Button`, `Input`.
- MovieCard'ın favori düğmesi erişilebilir button; SearchBox girdisi erişilebilir textbox olur.
