# Atölye: bağımsız pratik sözleşmesi

Amaç, öğrencinin “hangi hook'u veya dosyayı kullanacağım?” sorusunu kendisinin yanıtlayabilmesidir. Bu plan 15 modülde **42 coding görevi** tanımlar: 35 `code`, 7 testsiz `project`. Mevcut dersler ve Sinema checkpoint'leri değişmez. Her modülün gerçek son dersinden sonra `NN-atolye/` adlı **son ders** eklenir; `lesson.md` başlığı çift tırnaklı, `kind: practice` olur. Aşağıdaki bölüm başlıklarının Türkçe kısmı `lesson.md` başlığıdır. Görev klasörleri bu dersin `questions/` klasöründe iki haneli sıra numarası taşır. Kodlar `modül.ders.soru` biçimindedir.

Biçimler: **Teşhis et, düzelt** (çalışan ama hatalı starter; prompt yalnızca görülen belirti ve tekrar adımları), **Sadece gereksinim** (iş ihtiyacı ve public entry), **Refactor** (mevcut davranış + ikinci kullanım gereksinimi; kalite rubric'i), **Tasarım karşılaştırma** (iki component API'sinden seçim, kodda gerekçe, davranış testi ve rubric), **Mimari** (`type: 'project'`, `project: 'atolye'`, test yok, AI rubric'i). Mimari görevde öğrenci `projects/atolye/src/<task-slug>/` altındaki dosyaları kendisi oluşturur; her sorunun `reviewFiles` değeri tam olarak `['src/<task-slug>/**']` olur. Rubric 5–8 somut kontrol maddesi taşır. Diğer rubric'ler 4–8 maddedir. Kod görevlerinin testleri yalnızca tabloda belirtilen public entry üzerinden davranışı görür; iç dosyaya, hook çağrısına veya tek bir çözüme bağlanmaz.

**L1 rehberli (3–6):** dosya ve export adı verilir; yöntem de söylenebilir. **L2 yarı açık (9–16):** sadece testlerin import ettiği public entry söylenir; yöntem ipuçlarında kalır. **L3 açık (17–22):** iş gereksinimi ve gerekiyorsa public entry verilir; prompt'ta hook, kütüphane API'si veya iç dosya adı geçmez. Her düzeyde ipuçları yön → yöntem → neredeyse çözüm diye ilerler. Aşağıdaki teknik test stratejileri **yazar içindir**, L3 prompt'una aktarılmaz. L3'te “iki API” karşılaştırmasının seçenekleri ürün düzeyinde (örn. tek parça menü ile birlikte kullanılan alt parçalar) tarif edilir; yöntem ve API adları ipuçlarına bırakılır.

**Veri sınırı:** tarayıcı kod görevleri `curriculum/test-env/msw/` içindeki mevcut sahte TMDB (`https://api.themoviedb.org/3`), DummyJSON (`https://dummyjson.com`) ve Open Library (`https://openlibrary.org`) uç noktalarını kullanır. TMDB istekleri yetki başlığı veya `api_key` ister; ortak veride `curriculum/fixtures/tmdb/` film ve liste fixture'ları bulunur. DummyJSON sahtesinde **yalnızca** `/auth/login`, `/auth/me`, `/auth/refresh`, `/comments/add` vardır (`fixtures/dummyjson/`). Open Library sahtesinde `/search.json`, `/works/:id`, `/authors/:id` vardır (`fixtures/openlibrary/`). `/products`, `/carts`, `/posts` gibi DummyJSON uçları kod görevi testinde kullanılamaz. Mimari görevler VS Code'daki ayrı projede gerçek, anahtarsız DummyJSON veya Open Library API'sini kullanır; bu görevlerin otomatik testi yoktur. Planlanan Query ve form kullanımı `docs/research/react-ecosystem.md` içindeki güncel React Router 8, TanStack Query 5, RHF 7, Zod 4 ve RTK 2 akışlarıyla uyumludur.

## 3 · `13-atolye` — Kendi kararınla state ve bileşen

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `3.13.1` `01-siralama-ve-favori` | Sadece gereksinim · State · L1 | `src/MovieShelf.tsx` içindeki `MovieShelf` verilen TMDB popüler film fixture'ını başlığa göre sıralar; favori işaretleri sıralama değişse de doğru filmde kalır. | `MovieShelf.tsx` → `MovieShelf` | RTL ile sıralama ve ters sıralama sonrası favori davranışı. | `react.state`, `react.immutability`, `react.lists-keys` | `3.4` dizi güncellemesi → aynı öğeler sıralanınca kimlik korunur. |
| `3.13.2` `02-filtre-paneli-tasarimi` | Tasarım karşılaştırma · Bileşen · L1 | `src/MovieBrowser.tsx` içindeki `MovieBrowser` için filtre panelini tek bir `mode` prop'u veya ayrı kompozisyon parçalarıyla kur; seçimini kod yorumunda açıkla. TMDB popüler fixture'ındaki başlıklara göre filtreleme iki tasarımla da çalışmalı. | `MovieBrowser.tsx` → `MovieBrowser` | RTL filtre davranışı; rubric: anlaşılır API, gerekçeli seçim, tek sorumlu parça, tekrar kullanılabilirlik. | `react.composition`, `react.props`, `react.controlled-input` | `3.9` composition → aynı davranış için iki API tasarımını tartma. |

## 5 · `12-atolye` — State ve asenkron belirtileri

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `5.12.1` `01-secimden-tureyen-ozet` | Teşhis et, düzelt · State · L1 | Film seçimi değişince özet önceki filme ait kalıyor; TMDB `movie-550` ve `movie-27205` fixture'larıyla tekrar edilir. `src/MovieSummary.tsx` içindeki `MovieSummary` düzeltilir. | `MovieSummary.tsx` → `MovieSummary` | RTL seçimi değiştirip özetin aynı render'da yenilenmesini görür. | `react.derived-state`, `react.state` | `3.13.1` seçime bağlı görünüm → fazladan state kaynaklı bayat veri. |
| `5.12.2` `02-filtre-sayacini-esitle` | Sadece gereksinim · State · L1 | `src/GenreCounter.tsx` içindeki `GenreCounter`, TMDB `genres.json` verisindeki seçili türlere göre sayıyı anında gösterir; seçim temizlenince sıfırlar. | `GenreCounter.tsx` → `GenreCounter` | RTL seç/temizle akışı ve sayacın aynı anda değişmesi. | `react.derived-state`, `react.controlled-input` | `5.12.1` bayat özet → yeni veri türünde türetilmiş sayım. |
| `5.12.3` `03-eski-arama-kazaniyor` | Teşhis et, düzelt · Effects · L1 | “Dövüş” yazıp hemen “Matrix” yazınca önceki sonuç sonradan gelip yeni sonucu eziyor. `src/MovieSearch.tsx` içindeki `MovieSearch` üzerinde tekrar edilir. | `MovieSearch.tsx` → `MovieSearch` | MSW `/search/movie` gecikmelerini ters sırada döndürür; RTL son başlığı ve `requests()` sayısını görür. | `react.race-conditions`, `react.useEffect.cleanup`, `fetch.basics` | `5.4` yarış koşulu örneği → ardışık kullanıcı aramaları. |
| `5.12.4` `04-detay-degismiyor` | Teşhis et, düzelt · Effects · L1 | Aynı sayfada film kimliği 550'den 27205'e geçince hâlâ “Dövüş Kulübü” görünüyor. `src/MovieDetail.tsx` içindeki `MovieDetail` düzeltilir. | `MovieDetail.tsx` → `MovieDetail` | RTL prop değişimi, MSW `/movie/:id`, `requests()` ile yeni detayın geldiği doğrulanır. | `react.useEffect.deps`, `fetch.loading-states` | `5.3` dependency örneği → ekranda kalıp değişen prop. |

## 6 · `11-atolye` — URL değişirken veri

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `6.11.1` `01-geri-tusunda-eski-sonuc` | Teşhis et, düzelt · Effects · L1 | `/search?q=matrix` sayfasından `q=dovus`a gidip geri dönünce URL “matrix”, liste ise “Dövüş Kulübü” kalıyor. `src/SearchPage.tsx` içindeki `SearchPage` düzeltilir. | `SearchPage.tsx` → `SearchPage` | `createMemoryRouter` ile geri navigasyon, MSW `/search/movie`, RTL sonuç başlığı. | `router.search-params`, `react.useEffect.deps`, `react.race-conditions` | `5.12.4` değişen prop → artık URL değişiminin tetiklediği istek. |

## 9 · `10-atolye` — Sınırları seç

İlk mimari görev `prompt.md` içinde kurulumu açıkça verir: repo kökünde `pnpm setup:projects atolye`, sonra `pnpm install`, sonra `cd projects/atolye && pnpm dev`.

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `9.10.1` `01-arama-durumu-haritasi` | Sadece gereksinim · State · L2 | TMDB arama ekranında metin ve sayfa geri/ileri ile korunur; açık bilgi paneli gezinince kapanır; sunucudan gelen sonuç tekrar çağrılabilir. | `SearchWorkspace.tsx` → `SearchWorkspace` | Memory router + RTL geri/ileri ve panel davranışı; MSW `/search/movie`. | `arch.state-categories`, `router.search-params`, `react.state` | `6.11.1` URL/sonuç uyumu → URL, UI ve server state sınırını birlikte seçme. |
| `9.10.2` `02-iki-sayfada-film-listesi` | Refactor · Bileşen · L2 | Çalışan büyük ekranın film listesi hem popüler hem arama sayfasında kullanılmalı; boş, yükleme ve hata görünümleri korunmalı. | `MoviePages.tsx` → `MoviePages` | RTL iki sayfadaki aynı davranışı ve yeni kullanımını sınar; rubric: ortak görünüm, veri ayrımı, props açıklığı, davranış korunumu. MSW `/movie/popular`, `/search/movie`. | `arch.separation-of-concerns`, `arch.refactoring`, `react.composition` | `3.13.2` küçük API seçimi → gerçek ekranı bölüp yeniden kullanma. |
| `9.10.3` `03-filtre-api-secimi` | Tasarım karşılaştırma · Bileşen · L2 | Tek `filters` prop'u veya alt seçim parçalarıyla tür/sıralama kontrolü tasarla; seçimini yorumda savun. Kullanıcı aynı filtreleri ayarlayabilmeli. | `DiscoverFilters.tsx` → `DiscoverFilters` | RTL role üzerinden seçim ve sıfırlama; rubric: gerekçe, erişilebilir etiket, genişleme maliyeti, sorumluluk ayrımı. TMDB tür fixture'ı. | `arch.component-api`, `react.composition`, `react.controlled-input` | `3.13.2` iki basit API → birleşen iki kontrolün genişleme maliyeti. |
| `9.10.4` `04-urun-kesfi` | Mimari · Mimari · L2 | İlk Atölye projesi: DummyJSON **gerçek** `/products` verisiyle arama, kategori filtresi, detay ve geri dönüş sun; yükleme/boş/hata durumlarını göster. Prompt kurulum komutlarını da verir. | — | Rubric: arama + kategori + detay; URL ile geri dönüş; API hatası; erişilebilir durumlar; görev klasörü sınırı; veri/UI ayrımı. | `arch.feature-folders`, `arch.api-client`, `arch.state-categories`, `tooling.vite` | `9.7` güvenli refactor → dosyaları hazır almadan ilk feature sınırını kurma. |

## 11 · `12-atolye` — Görülen asenkron hatalar

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `11.12.1` `01-yavas-sonuc-gosteriliyor` | Teşhis et, düzelt · Effects · L2 | Arama alanı temizlendikten sonra yavaş eski sonuç tekrar beliriyor; alan boşken istek de gidiyor. | `MovieSearch.tsx` → `MovieSearch` | MSW `/search/movie` yavaş/boş senaryosu ve `requests()`; RTL boş ekranı kontrol eder. | `react.race-conditions`, `react.useEffect.cleanup`, `test.msw-overrides` | `5.12.3` iki dolu arama → temizlenen aramanın iptali ve boş giriş. |
| `11.12.2` `02-hatadan-sonra-yukleniyor` | Teşhis et, düzelt · Effects · L2 | Detay isteği 500 dönünce ekran “Yükleniyor”da kalıyor; başka filme geçince eski hata da görünebiliyor. | `MovieDetail.tsx` → `MovieDetail` | `server.use` ile `/movie/:id` 500/başarı; RTL hata, yeniden deneme ve geçiş. | `fetch.error-handling`, `fetch.loading-states`, `test.msw-overrides` | `5.12.4` kimlik değişimi → hata durumundan kurtulma. |

## 12 · `12-atolye` — Query merdiveninin ilk iki basamağı

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `12.12.1` `01-populer-film-onbellegi` | Sadece gereksinim · Query · L2 | TMDB `/movie/popular` listesini aç, ayrılıp dönünce kısa sürede aynı veriyi yeniden ağdan isteme; yükleme ve hata durumlarını göster. | `PopularMovies.tsx` → `PopularMovies` | Taze QueryClient sağlayıcısı, RTL yeniden mount ve `requests('/3/movie/popular')`. | `query.useQuery`, `query.keys`, `query.stale-gc` | `12.2` ilk sorgu → navigasyonda cache davranışını koruma (basamak 1). |
| `12.12.2` `02-ture-gore-kesif` | Sadece gereksinim · Query · L2 | `/discover/movie?with_genres=…&page=…` ile tür ve sayfa değiştir; geri dönülen seçim kendi sonucunu göstersin. | `GenreDiscover.tsx` → `GenreDiscover` | RTL tür/sayfa değişimi, MSW istek parametreleri ve geri dönüşte veri. | `query.keys`, `query.pagination`, `router.search-params` | `12.12.1` tek liste → tür + sayfa değişkenleriyle ayrı cache (basamak 2). |
| `12.12.3` `03-gunluk-icerik-panosu` | Mimari · Mimari · L2 | Gerçek DummyJSON `/posts` ve `/users` ile gönderi panosu ve yazar detayı oluştur; liste, arama, detay ve hata hali olsun. | — | Rubric: liste; yazar eşlemesi; detay; yükleme/hata; giriş rotası; API/UI sınırı. | `arch.feature-folders`, `arch.api-client`, `query.useQuery` | `9.10.4` ürün feature'ı → ilişkili iki veri kaynağı ve tekrar açılan sayfa. |

## 13 · `09-atolye` — Cache belirtilerini ayıkla

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `13.9.1` `01-tur-degisince-liste-ayni` | Teşhis et, düzelt · Query · L2 | Tür “aksiyon”dan “komedi”ye değişiyor ama film listesi aynı kalıyor; sayfa yenilenince düzeliyor. | `GenreDiscover.tsx` → `GenreDiscover` | MSW `/discover/movie` iki tür fixture'ı; RTL başlık ve `requests()` parametreleri. | `query.keys`, `test.msw`, `fetch.query-params` | `12.12.2` doğru çok değişkenli sonuç → yanlış cache davranışını tanıma (basamak 3). |
| `13.9.2` `02-puan-geri-alinamiyor` | Teşhis et, düzelt · Query · L2 | Film puanı anında değişiyor; sunucu 500 dönünce eski puan geri gelmiyor ve “Puanladıklarım” listesi bayat kalıyor. | `MovieRating.tsx` → `MovieRating` | MSW `POST /movie/:id/rating` hata/başarı, RTL puan ve liste, `requests()`; guest session fixture akışı. | `query.optimistic`, `query.invalidation`, `query.useMutation` | `13.3` optimistic örneği → hata rollback + ilişkili listeyi yenileme. |

## 14 · `11-atolye` — Formu kullanımda tamamla

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `14.11.1` `01-duzenle-formu` | Sadece gereksinim · Form · L2 | İzleme listesi adı/açıklaması düzenlenebilir; kaydetmeden başka liste seçilirse form yeni listenin değerlerini gösterir; değişmemiş form gönderilmez. | `WatchlistEditor.tsx` → `WatchlistEditor` | RTL prop değişimi, alan değerleri ve submit çağrısı; statik TMDB film fixture'ı bağlamı. | `form.rhf-reset`, `form.rhf-form-state`, `react.props` | `14.6` reset/defaultValues → mevcut kaydı başka kayıtla değiştirme. |
| `14.11.2` `02-sunucu-hatasi-formda` | Teşhis et, düzelt · Form · L2 | Film puanı gönderimi sunucudan hata alınca form başarılıymış gibi sıfırlanıyor; ikinci denemede seçilen puan kayboluyor. | `RatingForm.tsx` → `RatingForm` | MSW TMDB `POST /movie/:id/rating` 500/201 ve guest session; RTL hata, korunan seçim ve tekrar gönderim. | `form.rhf-errors`, `form.rhf-register`, `fetch.error-handling` | `14.7` mutation ile gönderim → başarısız istekten sonra düzenlemeye devam etme. |

## 15 · `11-atolye` — Kurallar ve veri değişimi

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `15.11.1` `01-tarih-araligi-kurali` | Sadece gereksinim · Form · L2 | İzleme planında bitiş tarihi başlangıçtan önce olamaz; hata ilgili alanda okunur ve geçerli değerle gönderim yapılır. | `PlanForm.tsx` → `PlanForm` | RTL geçersiz/geçerli giriş ve erişilebilir hata; yerel form verisi. | `zod.refine`, `zod.resolver`, `a11y.basics` | `14.11.1` tek kayıt düzenleme → alanlar arası kural. |
| `15.11.2` `02-degisen-giris-verisi` | Teşhis et, düzelt · Form · L2 | Farklı taslak seçilince form önceki varsayılanları gösteriyor; boş tarih bazen geçerli diye kabul ediliyor. | `DraftEditor.tsx` → `DraftEditor` | RTL taslak değişimi, boş/geçerli tarih ve submit; yerel fixture. | `form.rhf-reset`, `zod.transform`, `zod.refine` | `14.11.1` kayıt değişimi → giriş dönüşümü ve boş değer tuzağı. |

## 16 · `12-atolye` — State sınırı ve birleşik akış

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `16.12.1` `01-filtre-ve-favoriler` | Sadece gereksinim · State · L2 | Tür/sayfa paylaşılabilir URL'de, favori işaretleri gezinirken kalıcı, sunucu filmi güncel; geri tuşu eski filtreyi geri getirir. | `MovieWorkspace.tsx` → `MovieWorkspace` | Memory router + RTL filtre/favori/geri, MSW `/discover/movie`. | `arch.state-categories`, `redux.slice`, `router.search-params` | `9.10.1` üç state türü → kalıcı client state ekleme. |
| `16.12.2` `02-gorunum-tercihi-karisiyor` | Teşhis et, düzelt · State · L2 | Liste/kart görünümünü değiştirince film sonucu da sıfırlanıyor; yeni türe gidince eski favori işaretleri kayboluyor. | `MovieWorkspace.tsx` → `MovieWorkspace` | RTL görünüm/tür geçişi, MSW `/discover/movie`, favori korunumu. | `arch.state-categories`, `redux.selectors`, `react.derived-state` | `16.12.1` doğru sınır → birbirine karışmış client ve server state'i ayırma. |
| `16.12.3` `03-url-ile-cache-birlikte` | Sadece gereksinim · Query · L2 | Film aramasında `q` ve `page` paylaşılabilir; geri tuşu önceki sonucu gösterir, aynı aramaya dönünce uygun cache kullanılır. | `MovieSearchPage.tsx` → `MovieSearchPage` | Memory router + RTL geri/ileri, MSW `/search/movie`, `requests()` tekrar sayısı. | `query.keys`, `router.search-params`, `query.stale-gc` | `13.9.1` yanlış key teşhisi → URL state ile cache'i birleştirme (basamak 4). |
| `16.12.4` `04-kisisel-koleksiyon` | Mimari · Mimari · L2 | Gerçek DummyJSON `/products` ve `/carts` ile ürün seçme ve kişisel sepet özeti oluştur; filtre, detay ve toplam tutarı göster. | — | Rubric: ürün listesi; sepet etkileşimi; toplam hesabı; URL/client/server sınırı; hata; dosya sınırı. | `arch.state-categories`, `arch.feature-folders`, `redux.slice` | `12.12.3` iki kaynaklı pano → sunucu verisi ile kullanıcı seçimini ayırma. |
| `16.12.5` `05-kullanicinin-akisi` | Mimari · Mimari · L2 | Gerçek DummyJSON `/users`, `/posts`, `/comments` ile kullanıcıdan gönderi ve yoruma giden ekran kur; kayıp veride anlaşılır boş/hata durumu ver. | — | Rubric: kullanıcı listesi; ilişkili gönderi; yorum; URL gezintisi; yükleme/hata; erişilebilir boş durum. | `arch.api-client`, `arch.feature-folders`, `router.params` | `16.12.4` ürün/sepet → üç ilişkili sunucu kaynağının sınırını kurma. |

## 17 · `13-atolye` — Oturum ve hata akışı

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `17.13.1` `01-oturum-donusu` | Teşhis et, düzelt · Effects · L3 | Girişten sonra profil görülüyor; sayfa yenilenince boş ekran kalıyor ve ikinci denemede iki istek atılıyor. | `ProfileGate.tsx` → `ProfileGate` | MSW `/auth/login`, `/auth/me`; RTL yeniden mount ve `requests()`; verilen test kullanıcısı. | `auth.jwt`, `react.useEffect.cleanup`, `fetch.headers-auth` | `11.12.2` hata sonrası ekran → oturum geri yüklemede çift istek. |
| `17.13.2` `02-suresi-dolan-oturum` | Teşhis et, düzelt · Effects · L3 | Oturum süresi dolunca profil sonsuza dek yükleniyor; yeni giriş yapılsa bile eski hata görünüyor. | `SessionPanel.tsx` → `SessionPanel` | Fake timer + MSW `/auth/me`, `/auth/refresh`; RTL hata/yeni giriş, istek sayısı. | `auth.refresh`, `fetch.error-handling`, `test.fake-timers` | `17.13.1` ilk yükleme → zamanla bozulan oturum ve toparlanma. |
| `17.13.3` `03-giris-hatasi-ve-duzeltme` | Sadece gereksinim · Form · L3 | Yanlış bilgilerde hata okunur, yazılan kullanıcı adı korunur; bilgiler düzeltilince giriş tamamlanır ve tekrar gönderimde çift istek çıkmaz. | `LoginPanel.tsx` → `LoginPanel` | MSW `/auth/login` 400/200; RTL hata, düzeltme ve `requests()`. | `form.rhf-errors`, `auth.jwt`, `a11y.basics` | `14.11.2` yorum hatası → kimlik doğrulama ve tekrar gönderim. |

## 18 · `13-atolye` — Büyük veri, az yönlendirme

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `18.13.1` `01-siralama-yavasliyor` | Teşhis et, düzelt · State · L3 | Film listesinde yazarken kartlar takılıyor; metin değiştiğinde seçili favori işaretleri de kayabiliyor. | `MovieCatalog.tsx` → `MovieCatalog` | TMDB katalog fixture'ıyla RTL yazma/sıralama/favori; test görünür sonucu ve kimliği sınar, süre eşiği koymaz. | `react.derived-state`, `perf.rerender`, `react.lists-keys` | `16.12.2` state karışması → büyük listede türetilen görünüm ve öğe kimliği. |
| `18.13.2` `02-kesisen-listeler` | Sadece gereksinim · Query · L3 | Kullanıcı iki türü art arda açıp geri döndüğünde her türün kendi sonuçları görünür; kaydedilen bir işlem sonrası ilişkili liste güncel olur. | `GenreBoard.tsx` → `GenreBoard` | MSW `/discover/movie`, TMDB rating POST + rated list; RTL tür/işlem/geri ve `requests()`. | `query.keys`, `query.invalidation`, `router.search-params` | `16.12.3` URL + cache → değişiklik sonrası doğru veriyi yenileme (basamak 5). |
| `18.13.3` `03-yapilacaklar-panosu` | Mimari · Mimari · L3 | Gerçek DummyJSON `/todos` ve `/users` ile atanan işleri göster; kullanıcı seçimi, tamamlandı filtresi ve anlaşılır durum ekranları olsun. | — | Rubric: iş listesi; kullanıcı filtresi; tamamlanma görünümü; URL paylaşımı; hata/boş ekran; veri/UI sınırı. | `arch.state-categories`, `arch.feature-folders`, `perf.rerender` | `16.12.5` üç kaynaklı akış → daha büyük listede filtre ve görünüm maliyeti. |

## 19 · `12-atolye` — Erişilebilir component sınırları

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `19.12.1` `01-iki-yerde-secim-paneli` | Refactor · Bileşen · L3 | Çalışan büyük seçim ekranı hem ana sayfada hem detay sayfasında kullanılmalı; seçim, klavye ve focus davranışı korunmalı. | `SelectionPages.tsx` → `SelectionPages` | RTL iki sayfada seçim/klavye/focus; rubric: ortak parça, erişilebilirlik, yerel durum sınırı, davranış korunumu. | `arch.refactoring`, `a11y.keyboard`, `pattern.compound` | `9.10.2` iki sayfalı liste → etkileşim ve focus da yeniden kullanılır. |
| `19.12.2` `02-secici-api-secimi` | Tasarım karşılaştırma · Bileşen · L3 | Seçim kontrolünü tek yapılandırma nesnesiyle veya birlikte kullanılan küçük parçalarla sun; seçim ve hata açıklaması iki yaklaşımda da çalışmalı. Kod yorumunda gerekçe ver. | `ChoiceControl.tsx` → `ChoiceControl` | RTL role/name ve klavye; rubric: gerekçe, erişilebilir sözleşme, kontrollü değer, genişleme maliyeti. | `arch.component-api`, `pattern.compound`, `a11y.keyboard` | `9.10.3` filtre API'si → klavye ve hata sözleşmesi ekleme. |

## 20 · `06-atolye` — Paylaşılan UI ve form

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `20.6.1` `01-paylasilan-dialog` | Refactor · Bileşen · L3 | Çalışan büyük form içindeki onay penceresi ikinci ekrandaki silme akışında da kullanılmalı; kapatma ve focus davranışı iki yerde aynı kalmalı. | `DialogPages.tsx` → `DialogPages` | RTL iki ekran, Esc ve focus dönüşü; rubric: yeniden kullanılabilir parça, focus, küçük API, davranış korunumu. | `arch.refactoring`, `pattern.portal`, `a11y.focus` | `19.12.1` paylaşılan seçim → overlay ve focus yönetimi. |
| `20.6.2` `02-duzenleme-penceresi` | Sadece gereksinim · Form · L3 | Açılan düzenleme penceresi seçili kaydı doldurur; farklı kayıt açılınca yeni değerler gelir; geçersiz girişte açıklayıcı hata ve focus vardır. | `EditDialog.tsx` → `EditDialog` | RTL aç/kapat, kayıt değiştirme, role üzerinden hata/focus; yerel fixture. | `form.rhf-reset`, `zod.resolver`, `a11y.focus` | `15.11.2` değişen form verisi → modal yaşam döngüsü ve focus. |
| `20.6.3` `03-yorum-kurallari` | Sadece gereksinim · Form · L3 | Yorum başlığı ve metni birlikte geçerli olmalı; sunucu hatası kaydı kaybettirmemeli; başarıda açık geri bildirim verilmeli. | `ReviewPanel.tsx` → `ReviewPanel` | MSW `/comments/add` 500/201, RTL alan/hata/başarı; API implementasyonu serbest. | `zod.refine`, `form.rhf-errors`, `fetch.error-handling` | `17.13.3` giriş hatası → iki alanın birlikte kuralı ve sunucu cevabı. |

## 22 · `08-atolye` — Kitaplık bağlamında bağımsızlık

| Kod / klasör | Biçim · alan · düzey | Belirti veya gereksinim | Public entry | Test / rubric | Kavramlar | Tekrar ve yeni adım |
|---|---|---|---|---|---|---|
| `22.8.1` `01-kitap-arama-donus` | Sadece gereksinim · Query · L3 | Kitap araması, sayfa seçimi ve geri dönüşte önceki sonuç korunur; aynı sorguya dönünce gereksiz bekleme olmaz. | `BookSearch.tsx` → `BookSearch` | MSW `/search.json` (`Dune`, `Suç ve Ceza` fixture'ları; sayfalamada `limit=1`), memory router, RTL geri/sayfa ve `requests()`. | `query.keys`, `query.pagination`, `router.search-params` | `18.13.2` film türü/cache → başka servis ve arama sayfası (basamak 6). |
| `22.8.2` `02-eser-ve-yazar` | Teşhis et, düzelt · Query · L3 | Eser değiştiğinde eski yazar ve kapak yeni eserin yanında kalıyor; geri dönünce doğru eser görünmüyor. | `BookDetail.tsx` → `BookDetail` | MSW `/works/:id`, `/authors/:id` (Dune yazarı 200, diğer yazar 404); RTL eser değişimi/geri ve istek günlüğü. | `query.keys`, `query.dependent`, `router.params` | `22.8.1` arama cache'i → ilişkili eser/yazar cache sınırı. |
| `22.8.3` `03-okuma-listesi-tasarla` | Mimari · Mimari · L3 | Gerçek Open Library `/search.json` ve `/works/{id}.json` ile arama, eser detayı ve yerel okuma listesi sun; bağlantı paylaşılabilir olsun. | — | Rubric: arama; eser detayı; okuma listesi; URL; boş/hata; veri/UI sınırı. | `arch.state-categories`, `arch.feature-folders`, `capstone.state-map` | `18.13.3` filtreli görev panosu → dış API + kalıcı kişisel liste. |
| `22.8.4` `04-kitaplik-kararlarini-kaydet` | Mimari · Mimari · L3 | Gerçek Open Library arama ve yazar verisinden keşif ekranı kur; iki olası veri ve görünüm sınırı arasındaki seçimini kısa bir karar notunda gerekçelendir. | — | Rubric: arama; yazar bağlantısı; hata/boş durum; erişilebilirlik; sınır gerekçesi; bakım ödünleşimi. | `arch.adr`, `arch.api-client`, `capstone.requirements` | `22.8.3` çalışan Kitaplık → alternatif mimariyi tartıp kararını kaydetme. |

## Tekrar merdivenleri

Her ok, önceki örneğe eklenen **yeni** kısıtı gösterir. `M.d` gösterimi mevcut müfredat dersidir.

| Alan | Sıralı basamaklar ve yenilik |
|---|---|
| State (7) | `3.4` → `3.13.1` sıralamada kimlik → `5.12.1` bayat özet → `5.12.2` başka veriden sayım → `9.10.1` URL/UI/server sınırı → `16.12.1` kalıcı favori → `16.12.2` karışan state'i teşhis → `18.13.1` büyük listede kimlik ve hesap maliyeti. |
| Effects (7) | `5.4` → `5.12.3` cevap yarışı → `5.12.4` değişen kimlik → `6.11.1` geri tuşu → `11.12.1` boş arama/iptal → `11.12.2` 500'den kurtulma → `17.13.1` oturum geri yükleme → `17.13.2` süresi dolan oturum. |
| Query (8) | `12.2` → `12.12.1` benzer sorgu/cache → `12.12.2` farklı veri ve değişken key → `13.9.1` yanlış cache'i bul → `13.9.2` mutation rollback → `16.12.3` URL + cache → `18.13.2` iş gereksiniminden birleşik feature → `22.8.1` Kitaplıkta yeniden kullan → `22.8.2` ilişkili eser/yazar sınırı. Altı ana basamak `12.12.1`, `12.12.2`, `13.9.1`, `16.12.3`, `18.13.2`, `22.8.1`'dir. |
| Bileşen (6) | `3.9` → `3.13.2` iki API seçimi → `9.10.2` listeyi iki sayfaya ayır → `9.10.3` iki filtre API'sinin genişlemesi → `19.12.1` klavye/focus ile tekrar kullanım → `19.12.2` erişilebilir seçim API'si → `20.6.1` overlay'i iki ekrana taşı. |
| Form (7) | `14.6` → `14.11.1` farklı kaydı düzenle → `14.11.2` sunucu hatasında metni koru → `15.11.1` çapraz alan kuralı → `15.11.2` değişen varsayılan + dönüşüm → `17.13.3` giriş hatası → `20.6.2` modal içinde kayıt değişimi → `20.6.3` çapraz kural + sunucu cevabı. |
| Mimari (7) | `9.7` → `9.10.4` ilk ürün feature'ı → `12.12.3` gönderi/yazar → `16.12.4` server/client sepet sınırı → `16.12.5` üç ilişkili kaynak → `18.13.3` büyük görev listesi → `22.8.3` başka API ve kişisel liste → `22.8.4` karar gerekçesi. |

**Dağılım:** State 7, Effects 7, Query 8, Bileşen 6, Form 7, Mimari 7 = **42**. Modül başına sırasıyla `3:2`, `5:4`, `6:1`, `9:4`, `11:2`, `12:3`, `13:2`, `14:2`, `15:2`, `16:5`, `17:3`, `18:3`, `19:2`, `20:3`, `22:4`.
