Kitaplık uygulaması için adres çubuğundaki arama sorgusunu ve sayfa numarasını tek doğruluk kaynağı kabul eden, sonuçları 10'lu sayfalarda listeleyen ve kirli API verisini güvenle normalize eden arama özelliğini geliştirmen gerekiyor.

## Gereksinimler

Uygulamanın arama ve sayfalama davranışını şu kurallara göre kur:

1. **Arama Formu:**
   - En az `/` ve `/search` sayfalarında görünmelidir.
   - Erişilebilir etiketi (label veya `aria-label`) **Kitap ara** olan bir metin kutusu ve **Ara** butonu içermelidir.
   - Arama yalnızca **form gönderildiğinde** (Enter veya "Ara" tıklaması) tetiklenmelidir; metin kutusuna yazarken ağ isteği atılmamalıdır.
2. **URL Durumu ve Yönlendirme:**
   - Form gönderildiğinde adres `/search?q=<sorgu>` biçimine güncellenmelidir.
   - Sorgunun başındaki ve sonundaki boşluklar temizlenmelidir; boş veya yalnızca boşluktan oluşan girdilerde arama tetiklenmemeli ve sayfa değişmemelidir.
   - Yeni bir arama her zaman 1. sayfadan başlamalıdır.
   - `/search` sayfası `q` ve `page` parametrelerini URL'den okumalıdır. Mevcut sorgu metin kutusunda görünmelidir.
   - Geçersiz `page` parametreleri (`abc`, `0`, negatif sayılar) güvenle 1 olarak kabul edilmelidir.
   - `q` parametresi yoksa veya boşsa ağ isteği atılmamalı ve ekranda **Aramak için bir kitap adı ya da yazar yaz.** mesajı görünmelidir.
3. **Ağ İsteği ve Veri Normalizasyonu:**
   - İstek adresi: `GET https://openlibrary.org/search.json?q=<q>&page=<page>&limit=10`.
   - Ham API yanıtından gelen eksik alanlar (örneğin `cover_i` olmaması, `author_name` eksikliği) güvenli varsayılanlarla karşılanmalıdır.
4. **Sonuç Listesi ve Görsel Sunum:**
   - Sonuçlar semantik liste öğeleri (`<ul>`/`<ol>` ve `<li>`) içinde gösterilmelidir.
   - Her kitap kartında: başlık (tıklandığında `/works/<id>` yoluna giden link; id = `key` alanının son parçası, ör. `OL893414W`), virgülle ayrılmış yazarlar, ilk yayın yılı ve kapak görseli yer almalıdır.
   - Kapak: `https://covers.openlibrary.org/b/id/<cover_i>-M.jpg`. `cover_i` eksikse kırık resim yerine nötr bir yer tutucu gösterilmelidir. Yazar bilgisi yoksa **Yazar bilinmiyor** yazmalıdır.
   - Toplam sonuç sayısı Türkçe sayı biçiminde gösterilmelidir (örneğin `48.232 sonuç`). Sonuç bulunamadığında ekranda **sonuç bulunamadı** ifadesi geçmelidir.
5. **Sayfalama Kontrolleri:**
   - **Önceki** ve **Sonraki** kontrolleri ile `Sayfa X / Y` metni bulunmalıdır.
   - İlk sayfada Önceki, son sayfada Sonraki pasif olmalıdır (`disabled` veya `aria-disabled="true"`).
   - Sayfa değiştiğinde URL'deki `page` parametresi güncellenmeli, mevcut `q` parametresi korunmalıdır.
   - Sayfa geçişleri sırasında eski sonuçlar ekranda tutulmalı, anlık beyaz ekran oluşmamalıdır.
6. **Hata Durumu:**
   - Ağ veya sunucu hatası oluştuğunda `role="alert"` içeren bir uyarı ve **Tekrar dene** butonu görünmelidir. Butona tıklandığında istek yeniden atılmalıdır.

## Örnek

Kullanıcı arama kutusuna "Dune" yazıp "Ara" butonuna basar:
- Adres çubuğu `/search?q=dune` olur.
- Ekranda 10 adet kitap kartı, "Sayfa 1 / 2" ve "Sonraki" butonu görüntülenir.
- "Sonraki" butonuna basıldığında adres çubuğu `/search?q=dune&page=2` olur ve ikinci sayfanın sonuçları listelenir.

## Sözleşme

- Dışa aktarılan uygulama fonksiyonları:
  - `src/app/routes.tsx` → `createRoutes(queryClient: QueryClient): RouteObject[]`
  - `src/app/providers.tsx` → `AppProviders({ queryClient, children }: ...): React.JSX.Element`
- Arayüz metinleri ve erişilebilir roller:
  - Metin kutusu erişilebilir adı: `Kitap ara`
  - Arama butonu adı: `Ara`
  - Boş sorgu mesajı: `Aramak için bir kitap adı ya da yazar yaz.`
  - Sayfalama kontrolleri: `Önceki`, `Sonraki`, `Sayfa X / Y`
  - Hata uyarısı rolü: `role="alert"`, buton: `Tekrar dene`
  - Başarısız arama mesajı: `sonuç bulunamadı`

## Kısıtlar

- Arama sorgusu ve sayfa numarasının URL dışında bağımsız bir kopyası (`useState` veya global depoda) tutulmamalıdır; URL tek doğruluk kaynağıdır.
- API'ye atılan arama isteklerinde `limit=10` parametresi korunmalıdır.
