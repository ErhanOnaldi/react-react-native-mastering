# Kitaplık — Gereksinimler (v1)

> Durum: **Onaylandı** · Son güncelleme: 2026-09-25
> Kaynak: müşteri görüşmesi + Open Library API incelemesi

## 1. Amaç

Kitap okumayı seven ama neyi okuduğunu, neyi okumak istediğini unutan biri için **sade bir kitap takip uygulaması**. Kullanıcı Open Library'de kitap arar, detayına bakar ve kitabı kendi okuma listesine durumu, puanı ve kısa bir notla ekler. Hesap yok; liste bu tarayıcıda kalır.

## 2. Kullanıcı

**Elif**, 28 yaşında, ayda iki kitap okuyor. Çoğunlukla telefondan, metroda bakıyor. Arkadaşından duyduğu bir kitabı hemen listeye atmak, bitirdiğinde de puan verip iki satır not düşmek istiyor. Teknik biri değil: hata mesajı "500" değil, ne yapacağını söylemeli.

## 3. Sözlük

| Terim             | Anlamı                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Eser (work)**   | Bir kitabın baskıdan bağımsız hali. "Dune" tek eserdir; yüzlerce baskısı (edition) vardır. Uygulama eser düzeyinde çalışır. |
| **Eser id'si**    | Open Library anahtarının son parçası: `/works/OL893414W` → `OL893414W`.                                                     |
| **Okuma listesi** | Kullanıcının işaretlediği eserler: durum + (okuduysa) puan + not.                                                           |
| **Durum**         | `Okumak istiyorum` · `Okuyorum` · `Okudum`                                                                                  |

## 4. Kullanıcı hikâyeleri ve kabul kriterleri

### US-1 · Kitap aramak

**Kullanıcı olarak** kitap adı ya da yazarla arama yapmak istiyorum, **çünkü** aklımdaki kitabı bulmak istiyorum.

- **K-1** Arama kutusuna yazıp Enter'a (ya da "Ara"ya) bastığımda sonuçlar listelenir; yazarken istek atılmaz.
- **K-2** Adres `/search?q=<sorgu>` olur; bu linki paylaşınca karşı taraf aynı sonuçları görür. Sorgu kutuda görünür.
- **K-3** Her sonuçta başlık (detaya link), yazarlar (virgülle), ilk yayın yılı ve kapak vardır. Sayfa başına **10** sonuç.
- **K-4** Toplam sonuç sayısı Türkçe biçimde görünür: `48.232 sonuç`.
- **K-5** Boş ya da sadece boşluk içeren aramada istek atılmaz; `/search` sorgusuz açılırsa "Aramak için bir kitap adı ya da yazar yaz." görünür.
- **K-6** Sonuç yoksa "sonuç bulunamadı" mesajı görünür.

### US-2 · Sonuçlarda gezinmek

- **K-7** "Önceki" / "Sonraki" ile sayfa değişir, adres `&page=2` olur; "Sayfa 2 / 5" görünür. İlk sayfada "Önceki", son sayfada "Sonraki" pasiftir.
- **K-8** Yeni sayfa yüklenirken önceki sonuçlar ekranda kalır (liste boşalıp zıplamaz).
- **K-9** Yeni bir arama her zaman 1. sayfadan başlar. Bozuk `page` değeri 1 sayılır.

### US-3 · Kitap detayına bakmak

- **K-10** `/works/:workId` sayfasında başlık (h1), yazar(lar), açıklama ve büyük kapak görünür.
- **K-11** Açıklama yoksa "Açıklama yok." yazar. Yazar bilgisi alınamazsa sayfa yine açılır, "Yazar bilinmiyor" yazar.
- **K-12** Olmayan bir eserde "Kitap bulunamadı" görünür; başka bir hata olursa "Tekrar dene" butonlu bir uyarı çıkar.

### US-4 · Okuma listesine eklemek

- **K-13** Detay sayfasındaki formda Durum (varsayılan "Okumak istiyorum") ve Not vardır. Puan (1–5) yalnızca "Okudum" seçiliyken görünür ve o durumda zorunludur.
- **K-14** Not en fazla 280 karakterdir; hatalar alanın altında, ekran okuyucunun duyacağı şekilde gösterilir.
- **K-15** Kitap zaten listedeyse form kayıtlı değerlerle açılır, buton "Güncelle" olur; "Listeden çıkar" seçeneği vardır.
- **K-16** Menüdeki "Okuma listem (n)" sayısı her sayfada günceldir.

### US-5 · Listemi yönetmek

- **K-17** `/reading-list` sayfası eserleri başlık (detaya link), durum, puan (`Puan: 4/5`) ve notla listeler; liste boşsa "Okuma listen boş." der.
- **K-18** Durum filtresi adrese yazılır (`?status=read`), paylaşılabilir.
- **K-19** Her kitap listeden tek tıkla çıkarılabilir.

### US-6 · Listem kaybolmasın

- **K-20** Liste tarayıcıda (`localStorage`, anahtar `kitaplik:reading-list`) saklanır; sayfa yenilenince geri gelir.
- **K-21** Kayıtlı veri bozuksa (elle oynanmış, eski sürüm) uygulama çökmez; liste boş başlar.

## 5. Gerçek veriden çıkan kenar durumları

Open Library cevapları incelenerek bulundu (bkz. `curl 'https://openlibrary.org/search.json?q=dune&limit=2'`):

| Durum                | Örnek                                                                   | Beklenen davranış                                   |
| -------------------- | ----------------------------------------------------------------------- | --------------------------------------------------- |
| Kapak yok            | `cover_i` alanı hiç yok                                                 | Kırık görsel yerine yer tutucu                      |
| "Kapak yok" işareti  | eserin `covers` dizisinde `-1`                                          | `-1` kapak sayılmaz                                 |
| Yazar yok            | `author_name` yok                                                       | "Yazar bilinmiyor"                                  |
| Açıklama iki biçimde | `"description": "..."` ya da `{ "type": "/type/text", "value": "..." }` | İkisi de metin olarak gösterilir                    |
| Yazar kaydı yok      | `/authors/OL22242A.json` → 404                                          | Sayfa çalışır, "Yazar bilinmiyor"                   |
| Farklı alfabe        | `Фёдор Михайлович Достоевский`                                          | Olduğu gibi gösterilir                              |
| Çok büyük sonuç      | `numFound: 48232`                                                       | `48.232 sonuç`, sayfalama                           |
| Yavaş cevap          | 1–3 sn                                                                  | Yükleniyor durumu; sayfa geçişinde eski liste kalır |

## 6. İşlevsel olmayan gereksinimler

- **API nezaketi:** Open Library gönüllülerin işlettiği ücretsiz bir servis. Her tuşta değil form gönderilince aranır; `fields` parametresiyle yalnızca kullanılan alanlar istenir; aynı veri kısa sürede tekrar istenmez (önbellek).
- **Erişilebilirlik:** Tüm form alanlarının etiketi var; hatalar `role="alert"` ile duyurulur; klavyeyle her şey yapılabilir; sayfa dili `tr`.
- **Mobil:** 360 px genişlikte yatay kaydırma yok.
- **Gizlilik:** Kişisel veri sunucuya gitmez; liste yalnızca bu tarayıcıda.
- **Kalite:** Lint, tip kontrolü, birim/entegrasyon ve E2E testleri her push'ta CI'da çalışır.

## 7. Kapsam dışı (v1)

Hesap ve giriş · listenin cihazlar arası eşitlenmesi · yazar sayfası · sonsuz kaydırma · baskı (edition) seçimi · çevrimdışı çalışma · çoklu dil.

## 8. Açık sorular

1. Liste dışa aktarılabilsin mi (JSON/CSV)? → v2'ye not edildi.
2. "Okudum" için bitiş tarihi tutulsun mu? → Müşteriye soruldu, cevap bekleniyor.
