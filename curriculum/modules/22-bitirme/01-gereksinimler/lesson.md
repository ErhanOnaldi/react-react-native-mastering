---
title: "Gereksinimler: “bitti” ne demek?"
minutes: 10
kind: project
---

# Gereksinimler: “bitti” ne demek?

:::pain[Problem]
Sinema v1’i (7. modül) yazarken kimse sana şunları sormadı: *Arama kutusu boşken ne gösterilecek? Posteri olmayan filmde ne olacak? Olmayan bir film id’si açılınca?* Bu soruların cevabını kodu yazarken, tek tek **bug olarak** keşfettin — `NOTES.md` acı günlüğün bunlarla doldu.

Sorun kodda değildi: “bitti” kelimesinin ne demek olduğu hiç yazılmamıştı. Tanımı olmayan bir işi ne bitirebilirsin ne de test edebilirsin.
:::

Bu derste henüz tek satır kod yazmıyorsun. Müşterinin belirsiz isteğini, herkesin aynı şekilde anladığı ve **test edilebilen** bir belgeye çeviriyorsun: `REQUIREMENTS.md`.

## Müşteriden gelen mesaj

> “Kitap okumayı seviyorum ama neyi okuduğumu, neyi okumak istediğimi hep unutuyorum. Bir kitabı arayıp detayına bakabileceğim, ‘okumak istiyorum / okuyorum / okudum’ diye işaretleyip kısa not düşebileceğim sade bir uygulama istiyorum. Open Library’nin ücretsiz bir API’si var, anahtar istemiyor. Telefonda da rahat açılsın. Hesap, giriş falan istemem; bu tarayıcıda kalsın yeter.”

Güzel bir mesaj. Ama içinde tek bir ölçülebilir cümle yok. “Sade” ne kadar sade? “Rahat açılsın” neyle ölçülür? Arama kaç sonuç gösterir?

## Belirsizden ölçülebilire

İyi bir gereksinim **doğru ya da yanlış** diye kontrol edilebilir. Kontrol edemiyorsan, test de yazamazsın.

| Belirsiz | Ölçülebilir |
| --- | --- |
| “Arama hızlı olsun.” | Aynı arama 5 dakika içinde tekrar açılırsa **yeni istek atılmaz**. |
| “Kullanıcı dostu hata mesajı.” | Sunucu hatasında `role="alert"` bir uyarı ve **“Tekrar dene”** butonu görünür. |
| “Liste kaybolmasın.” | Liste `localStorage`’da saklanır; sayfa yenilenince geri gelir; bozuk kayıt uygulamayı çökertmez. |
| “Sayfalama olsun.” | Sayfa başına 10 sonuç; “Sayfa 2 / 5”; ilk sayfada “Önceki” pasif. |

## Kullanıcı hikâyesi + kabul kriterleri

Sektörün ortak dili iki parçadır:

**Kullanıcı hikâyesi** — kim, ne istiyor, *neden*:

> **Kullanıcı olarak** kitap adı ya da yazarla arama yapmak istiyorum, **çünkü** aklımdaki kitabı bulmak istiyorum.

“Çünkü” kısmı süs değil: bir özelliği kesip kesmemeye karar verirken bakacağın yer orası.

**Kabul kriterleri** — hikâyenin “bitti” sayılması için doğru olması gerekenler. En net yazım *Diyelim ki / … yaptığımda / … görürüm* (İngilizcesi **Given / When / Then**):

```text
K-5  Diyelim ki arama kutusu boş ya da sadece boşluk içeriyor,
     Enter'a bastığımda,
     hiçbir istek atılmaz ve sayfa değişmez.
```

Bu cümle neredeyse bir test adı: `it('boş ya da sadece boşluk içeren aramada istek atmaz')`. 6. derste kendi testlerini yazarken kriterlerini **test başlığı** olarak kullanacaksın.

## Önce veriyi tanı

Gereksinimleri kafadan yazma; önce API’nin gerçekte ne döndürdüğüne bak. Terminalde dene (Open Library anahtar istemez):

```bash
curl 'https://openlibrary.org/search.json?q=dune&limit=2&fields=key,title,author_name,first_publish_year,cover_i'
curl 'https://openlibrary.org/works/OL893414W.json'
curl 'https://openlibrary.org/authors/OL79034A.json'
```

Kısaltılmış bir arama cevabı:

```json
{
  "numFound": 48232,
  "docs": [
    {
      "key": "/works/OL893414W",
      "title": "Dune",
      "author_name": ["Frank Herbert"],
      "first_publish_year": 1965,
      "cover_i": 11481354
    },
    { "key": "/works/OL12943962W", "title": "Suc ve ceza", "author_name": ["Фёдор Михайлович Достоевский"] }
  ]
}
```

Birkaç dakikalık `curl` sana şunları söyler — hepsi birer **kenar durumu** ve gereksinim belgesine girmeli:

- Bazı kitaplarda `cover_i` **hiç yok**; eser kaydındaki `covers` dizisinde “kapak yok” anlamında `-1` olabiliyor.
- `author_name` eksik olabiliyor; olduğunda bile Kiril alfabesiyle gelebiliyor.
- Eserin `description` alanı bazen düz metin, bazen `{ "type": "/type/text", "value": "..." }` **nesnesi**.
- Yazar bilgisi eser kaydında yok, sadece anahtarı var (`/authors/OL79034A`) → ikinci bir istek gerekiyor; o istek 404 dönebiliyor.
- `numFound` 48.232 olabiliyor; sayfa sayısını sen hesaplıyorsun (`total_pages` yok — TMDB’den farkı).
- Cevaplar 1–3 saniye sürebiliyor.

:::tip[Sözlük yaz]
Open Library’de bir **eser** (work, “Dune”) ile onun yüzlerce **baskısı** (edition) ayrı kayıtlardır. Belgenin başına küçük bir sözlük koy: ekipteki herkes “kitap” derken aynı şeyi kastetsin.
:::

## Sabit sözleşme: ekibin önceden verdiği kararlar

Gerçek projelerde bazı kararlar sen gelmeden verilmiştir: tasarımcı metinleri yazmış, backend adresleri belirlemiş. Kitaplık’ta da öyle. Aşağıdakiler **değişmez**; platformun testleri bunlara bakar. Geri kalan her şey (klasör yapısı, state yönetimi, bileşenler, stil) **senin kararın**.

| Konu | Karar |
| --- | --- |
| Adresler | `/` ana sayfa · `/search?q=dune&page=2` arama · `/works/OL893414W` eser detayı · `/reading-list?status=read` okuma listem (`status`: `want`, `reading`, `read`) · diğer her adres “Sayfa bulunamadı” |
| Arama | Form gönderilince (Enter / “Ara”) yapılır, yazarken değil. Sayfa başına **10** sonuç: `GET https://openlibrary.org/search.json?q=…&page=…&limit=10` |
| Detay | `GET /works/{id}.json`, yazarlar için `GET /authors/{id}.json` |
| Kapaklar | `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg` (`S`, `M`, `L` boyutları) |
| Okuma listesi | Tarayıcıda, `localStorage` anahtarı `kitaplik:reading-list` |
| Arayüz metinleri | Ana sayfa h1 **Kitaplık** · arama kutusu etiketi **Kitap ara**, buton **Ara** · **Önceki / Sonraki**, **Sayfa 2 / 5** · **Tekrar dene** · **Yazar bilinmiyor** · **Açıklama yok.** · **Kitap bulunamadı** · menüde **Okuma listem (n)** |

Metinlerin tamamı ilgili görevlerde tekrar listelenecek; şimdilik belgeye kararların kendisini yaz.

## İşlevsel olmayan gereksinimler ve kapsam dışı

“Ne yapacak?”ın yanında “**nasıl** olacak?” da gereksinimdir: erişilebilirlik (her alanın etiketi var, hatalar duyuruluyor), mobil (360 px’te yatay kaydırma yok), gizlilik (veri tarayıcıdan çıkmıyor), **API nezaketi** (gönüllü bir servisi her tuşta yormamak).

En az onun kadar önemli bir bölüm: **kapsam dışı**. “Hesap ve giriş yok, cihazlar arası eşitleme yok, sonsuz kaydırma yok.” Bunu yazmazsan her toplantıda yeni bir özellik “küçük bir ekleme” olarak içeri sızar (*scope creep*).

:::mistake
Gereksinim belgesine **çözüm** yazmak: “Okuma listesi Redux’ta tutulur.” Bu bir gereksinim değil, mimari karardır ve bir sonraki dersin konusu (ADR). Gereksinim *ne* ve *neden*i söyler; *nasıl*ı ekip seçer. Karışırsa, yarın Redux’tan vazgeçtiğinde gereksinim belgen yanlış hale gelir.
:::

:::sector
Şirketlerde bu belgenin adı değişir — PRD (*product requirements document*), “spec”, Jira’daki epic’ler — ama iskelet aynıdır: amaç, kullanıcı, hikâyeler, kabul kriterleri, kapsam dışı, açık sorular. BDD kullanan ekipler kabul kriterlerini Gherkin (`Given/When/Then`) diliyle yazıp doğrudan otomatik teste çevirir. “Bitti tanımı” (*Definition of Done*) da çoğu ekipte yazılı bir sözleşmedir: “kriterler testlerle kanıtlandı, review’dan geçti, CI yeşil.”
:::
