Ana sayfada belirli bir film türünü filtreleme ve sonuçlar arasında sayfalar halinde gezinebilme desteği bulunmalıdır. Tür seçimi ve sayfalama durumunu URL ile senkronize bağla.

## Gereksinimler

- Harici servisten (`/genre/movie/list`) film türleri listesi çekilmeli ve erişilebilir bir açılır kutu (`combobox`, etiketi "Tür seç") içinde listelenmelidir.
- URL'de `genre` parametresi varsa filmler tür bazlı keşif adresinden (`/discover/movie?with_genres=<genre>&page=<page>`), `genre` yoksa haftalık trend adresinden (`/trending/movie/week`) çekilmelidir.
- Kullanıcı farklı bir tür seçtiğinde URL'deki `genre` güncellenmeli ve eski sayfa numarası (`page`) silinmelidir.
- Sayfa numarası URL'deki `page` parametresinden okunmalı ve ekranda geçerli sayfa durumu (ör. "Sayfa 1") gösterilmelidir.
- "Sonraki" ve "Önceki" düğmeleri toplam sayfa sınırlarını aşmayacak şekilde URL'deki `page` değerini artırmalı veya azaltmalıdır.
- Her parametre değişiminde yeni istek için yükleme durumu gösterilmeli; filtre değiştiğinde önceki sonuçlar ekrandan kaldırılmalıdır.

## Örnek

- Kullanıcı `/?genre=28` adresini açtığında tür kutusunda "Aksiyon" seçili gelir, "Sayfa 1" metni görünür ve keşfet servisine `with_genres=28` isteği gider.
- Kullanıcı "Sonraki" düğmesine tıkladığında URL `/?genre=28&page=2` olur ve ekranda "Sayfa 2" belirir.
- Kullanıcı `/?genre=28&page=2` adresindeyken türü "Komedi" olarak değiştirdiğinde URL `/?genre=35` haline gelir (`page` silinir).

## Sözleşme

- Dosya ve export: `src/pages/HomePage.tsx` → `HomePage` (named export)
- Tür seçici: `role="combobox"` ve erişilebilir adı `/tür seç/i` olan `<select>` ögesi.
- Sayfa durumu: Ekranda `/Sayfa \d+/` kalıbına uyan sayfa numarası metni.
- Düğmeler: `name: "Sonraki"` ve `name: "Önceki"` etiketli sayfalama butonları.
- İstekler: `/genre/movie/list` (tür listesi) ve `genre` seçimine göre `/discover/movie` veya `/trending/movie/week`.
