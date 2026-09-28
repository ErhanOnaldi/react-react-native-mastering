Sinema'nın statik katalog ekranı için fixture'lardan tipli film verisi ve yeniden kullanılabilir gösterim bileşenleri hazırla. Veri bu aşamada ağdan yüklenmeyecek.

## Gereksinimler

- Gerçek film verilerinden 10–14 farklı kayıt hazırlanmalıdır; 550 Dövüş Kulübü, 155 Kara Şövalye ve 603 Matrix listede bulunmalıdır.
- Her film kartında başlık görünür olmalı; favori düğmesinin adı film başlığıyla birlikte “Favoriye ekle” veya “Favoriden çıkar” eylemini içermelidir.
- Favori düğmesinin `aria-pressed` değeri `isFavorite` prop'unu yansıtmalı; tıklama ilgili film kimliğini üst bileşene iletmelidir.
- Film listesi her kartı ayrı göstermeli ve boş liste durumunda “Film bulunamadı” yazmalıdır.
- Arama alanı verilen değeri göstermeli ve yazılan yeni değeri üst bileşene iletmelidir.
- Poster yolu boş olan film için bozuk görsel yerine anlaşılır metin gösterilmelidir.

## Örnek

Film kartı Dövüş Kulübü için `isFavorite={false}` aldığında “Dövüş Kulübü Favoriye ekle” adı görünür; tıklama `550` id'sini callback'e iletir.

## Sözleşme

- `src/data/sample-movies.ts` → named export `sampleMovies: Movie[]`; `Movie` tipi `src/types/tmdb.ts`'den.
- `src/components/MovieCard.tsx` → named export `MovieCard`; props `{ movie: Movie; isFavorite: boolean; onToggleFavorite: (id: number) => void }`.
- `src/components/MovieGrid.tsx` → named export `MovieGrid`; props `{ movies: Movie[]; favoriteIds: number[]; onToggleFavorite: (id: number) => void }`.
- `src/components/SearchBox.tsx` → named export `SearchBox`; props `{ value: string; onChange: (value: string) => void }`.
- Arayüz: “Film ara” adlı textbox, film başlıkları ve erişilebilir favori düğmeleri.

## Kısıtlar

- Fixture verisini `curriculum/fixtures/tmdb/` içinden al; gerekli üç id dışında film id'leri benzersiz olsun.
- `poster_path` null olabilir. Detay verisinde tür kimlikleri bulunmuyorsa `genres` verisiyle `Movie` biçimine uyumlu olmalıdır.
- Runtime'da fetch çağrısı yapılmamalıdır.
