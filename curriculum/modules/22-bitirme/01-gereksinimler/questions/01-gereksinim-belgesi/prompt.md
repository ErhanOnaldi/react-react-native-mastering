Kitaplık uygulamasının geliştirilmesine başlamadan önce, belirsiz ürün isteklerini ölçülebilir kabul kriterleri, kenar durumları, güvenlik ve yayına hazırlık kurallarıyla tanımlayan kapsamlı bir gereksinim belgesi hazırlaman gerekiyor.

## Gereksinimler

`projects/kitaplik/REQUIREMENTS.md` dosyasında şu bölümleri eksiksiz tanımla:

- **Amaç:** 2–3 cümlede uygulamanın ne yaptığı, kimin için geliştirildiği ve temel faydası.
- **Kullanıcı:** Somut bir persona (kullanıcının kim olduğu, ortamı ve cihaz tercihleri).
- **Sözlük:** Temel kavram tanımları (en az: *eser (work)*, *baskı (edition)*, *eser kimliği*, *okuma listesi*, *durum*).
- **Kullanıcı Hikâyeleri ve Kabul Kriterleri:** Arama, sayfalama, eser detayı, okuma listesine ekleme/güncelleme/çıkarma ve yerel kalıcılık. Her kriter numaralı (K-1, K-2...) ve test edilebilir kesinlikte olmalıdır.
- **Sabit Sözleşme:** Belirlenmiş sabit kurallar belgede yer almalıdır:
  - Adresler: `/` (ana sayfa), `/search?q=...&page=...`, `/works/:workId`, `/reading-list?status=...` (ve tanımsız adreslerde "Sayfa bulunamadı").
  - Arama: Form gönderilince (Enter / "Ara") tetiklenir; sayfa başına 10 sonuç.
  - Arayüz metinleri: Başlık "Kitaplık", arama kutusu erişilebilir etiketi "Kitap ara", buton "Ara", "Önceki", "Sonraki", "Sayfa X / Y", "Tekrar dene", "Yazar bilinmiyor", "Açıklama yok.", sonuçsuz aramada "sonuç bulunamadı", eser 404 olduğunda "Kitap bulunamadı", menüde "Okuma listem (n)".
  - Kalıcılık: `localStorage` anahtarı `kitaplik:reading-list`.
- **Kenar Durumları:** Gerçek API verisinden kaynaklanan durumlar ve beklenen davranışlar:
  - Kapak görseli id'si yoksa veya `-1` ise kırık resim yerine yer tutucu gösterilmesi.
  - Yazar bilgisi eksikliği veya Kiril alfabesiyle gelmesi.
  - Eser açıklamasının düz metin veya `{ type, value }` nesnesi olarak gelmesi.
  - Bağımlı yazar isteğinin 404 dönmesi halinde eserin korunması.
  - Yüksek sonuç sayıları (`numFound`) karşısında sayfa sınırının yönetilmesi.
- **Güvenlik Kriterleri:**
  - Kullanıcı girdisi veya dış API kaynaklı metinlerin doğrudan HTML olarak basılmaması (XSS risklerinin önlenmesi).
  - Harici bağlantıların güvenli açılması (`rel="noreferrer"`).
  - İstemci tarafında bundle içine gömülen gizli anahtar veya yetkili kimlik bilgisi tutulmaması.
- **Yayına Hazırlık Kriterleri:**
  - SPA fallback yönlendirmesi (tüm alt yolların `index.html`'e düşmesi).
  - Statik varlıklar için önbellek stratejisi (hash'li JS/CSS için uzun süreli cache, `index.html` için `no-cache`).
  - Çalışma zamanında yakalanamayan hataların izlenmesi/raporlanması yaklaşımı.
- **İşlevsel Olmayan Gereksinimler:** Erişilebilirlik (etiketler, duyurular), mobil uyumluluk (360px yatay kaydırma olmaması), gizlilik (verinin tarayıcıda kalması) ve API nezaketi.
- **Kapsam Dışı:** İlk sürümde (v1) yapılmayacak özelliklerin açık listesi (kullanıcı hesabı, sunucu eşitlemesi vb.).
- **Açık Sorular:** Müşteriye veya paydaşlara sorulması gereken belirsizlikler.

## Örnek

Bir kabul kriteri şu yapıda olmalıdır:

```text
K-5  Diyelim ki arama kutusu boş veya yalnızca boşluklardan oluşuyor,
     Kullanıcı "Ara" butonuna bastığında veya Enter'a bastığında,
     Ağ üzerinden hiçbir istek atılmaz ve mevcut sayfa/URL değişmez.
```

## Sözleşme

- Dosya yolu: `projects/kitaplik/REQUIREMENTS.md`

## Kısıtlar

- Belgeye seçtiğin uygulama yöntemi (örneğin "Redux kullanılacak" veya "useState ile tutulacak") yazılmamalıdır; yalnızca iş gereksinimi ve gözlenebilir davranışlar tanımlanmalıdır. Bu görevde sabit sözleşme olarak verilen rota, arayüz metni ve `localStorage` anahtarı kararları ise değiştirilemez gereksinimlerdir; kendi mimari tercihin değildir.
