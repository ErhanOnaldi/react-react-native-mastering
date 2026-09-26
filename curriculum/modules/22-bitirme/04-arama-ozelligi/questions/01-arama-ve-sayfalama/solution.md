Referans çözüm: `curriculum/checkpoints/kitaplik/22/src/features/books/` (`api/`, `components/SearchForm.tsx`, `pages/SearchPage.tsx`, `search-params.ts`).

## Neden böyle?

- **Katmanlar:** `openLibraryGet(path, schema)` ağ + HTTP hatası + doğrulamadan sorumlu; `searchBooks` hangi parametrelerin gideceğini bilir; `bookQueries.search` önbellek kimliğini (key) ve tazelik süresini bilir; `SearchPage` sadece durumları çizer. Open Library bir gün alan adını değiştirirse tek bir şema dosyası değişir.
- **`enabled` ile `skipToken` arasında:** ikisi de boş sorguda isteği durdurur. `skipToken` tipleri daha sıkı tutar ama `refetch()` ile birlikte kullanılamaz; bu sayfada “Tekrar dene” `refetch` kullandığı için `enabled` daha rahat.
- **Kontrolsüz input + `key={q}`:** Kontrollü bir input için URL ile state’i effect’le senkron tutman gerekirdi (5. modüldeki “effect’e gerek yok” uyarısını hatırla). `key` değişince React input’u sıfırdan kurar; senkronizasyon kodu hiç yazılmaz.
- **Sayfalama link:** “Sonraki”yi yeni sekmede açmak, sağ tıklayıp kopyalamak çalışır. `aria-disabled` olan bir `<span>` hem görsel hem erişilebilir biçimde “yok” demenin sade yolu.
- **`toLocaleString('tr-TR')`:** “48232” ile “48.232” arasındaki fark küçük görünür ama kullanıcı için ürünün yerel hissettirmesidir. `Intl` API’si tarayıcıda hazır; kütüphane gerekmez.

## Sık tuzaklar

| Belirti | Sebep |
| --- | --- |
| “Sonraki”ye basınca liste bir an boşalıyor | `placeholderData: keepPreviousData` yok |
| “Sayfa 2” yazıyor ama 1. sayfanın kitapları görünüyor | `page` query key’de değil |
| Geri tuşuna basınca input eski sorguyu göstermiyor | Input URL’den beslenmiyor ya da `key` yok |
| Boşluklu arama `/search?q=%20%20` adresine gidiyor | Gönderimde `trim()` ve boş kontrolü yok |
| Kapaksız kitapta kırık resim ikonu | `cover_i` yokken `…/b/id/undefined-M.jpg` üretiliyor |

5. derste arama sonucuna tıklanınca açılan detay sayfasını ve okuma listesini yazacaksın.
