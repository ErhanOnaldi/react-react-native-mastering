## Bağlam

Üç spec dosyası arama yapıyor ve her biri beklemeyi kendince yazmış; ikisi ara sıra kalıyor. Arama sayfasının bilgisini (locator’lar, eylemler, **doğru bekleme**) tek bir page object’te toplayacağız. Spec’ler bundan sonra yalnızca `searchPage.search('matrix')` diyecek.

## Görev

`SearchPage` sınıfını tamamla:

| Üye | Ne yapar? |
| --- | --- |
| `searchBox` | “Film ara” arama kutusu (`searchbox`) |
| `results` | “Arama sonuçları” bölgesindeki (`region`) sonuç maddeleri (`listitem`) |
| `goto()` | `/search` sayfasını açar |
| `search(query)` | Sorguyu kutuya yazar ve **bu sorgunun** sonuçları ekrana gelene kadar bekler |
| `resultTitles()` | Şu an listelenen film adlarını (sonuç bağlantılarının metni) dizi olarak döndürür; kendisi beklemez |
| `openMovie(title)` | Sonuçlardan adı **tam** `title` olan filme tıklar; detay sayfasında filmin başlığı (h2) görünene kadar bekler |

## Sayfa nasıl davranıyor?

- Kutuya yazınca **350 ms** debounce, sonra “Aranıyor…” görünür. Bu görevde arama cevabı **800 ms**, detay **600 ms** sürüyor.
- Cevap gelince bölgede bir başlık ve liste çıkar:

```html
<section aria-label="Arama sonuçları">
  <h3>“matrix” için 2 sonuç</h3>
  <ul>
    <li><a href="/movie/603">Matrix</a> (1999)</li>
    <li><a href="/movie/604">Matrix Reloaded</a> (2003)</li>
  </ul>
</section>
```

- Sonuç yoksa: `<h3>“xyz” için 0 sonuç</h3><p>Sonuç bulunamadı.</p>`.
- İkinci bir arama yazdığında **eski sonuçlar** yeni cevap gelene kadar bir süre ekranda kalır.

## Örnek

```ts
const searchPage = new SearchPage(page)
await searchPage.goto()
await searchPage.search('matrix')
await searchPage.resultTitles() // ['Matrix', 'Matrix Reloaded'] — hemen, beklemeden
await searchPage.search('dövüş')
await searchPage.resultTitles() // ['Dövüş Kulübü'] — eski Matrix sonuçları değil
await searchPage.openMovie('Matrix Reloaded') // /movie/604, başlık görünüyor
```

Constructor’da parameter property (`constructor(readonly page: Page)`) kullanma; alanlar zaten tanımlı.
