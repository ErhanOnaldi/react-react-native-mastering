Uygulamanın trend, arama ve filtreleme istekleri aynı taban adresi ve dil tercihini paylaşır. Sorgu parametreleri elle metin olarak birleştirildiğinde özel karakterler ve boşluklar istek adresini bozar. Verilen yol ve parametreleri geçerli bir istek adresine dönüştüren yardımcı bir fonksiyon yaz.

## Gereksinimler

- Taban adres olarak her zaman `https://api.themoviedb.org/3` kullanılır.
- Verilen yolun başında `/` karakteri olsun ya da olmasın, taban adres ile yol arasında tek bir eğik çizgi bulunmalıdır.
- İstek adresine varsayılan olarak `language=tr-TR` parametresi eklenir. Ancak parametreler arasında açıkça başka bir `language` değeri verilmişse bu değer korunur.
- Parametre nesnesi içindeki metin (`string`) ve sayı (`number`) türündeki değerler sorgu parametresi olarak eklenir; `undefined` değerine sahip alanlar adrese yazılmaz.
- Özel karakterler, boşluklar ve `&` gibi ayraçlar sorgu dizesinde standartlara uygun biçimde kodlanır.

## Örnek

| Yol (`path`) | Parametreler (`params`) | Çıktı URL Sorgusu |
| --- | --- | --- |
| `"/trending/movie/week"` | Yok | `.../3/trending/movie/week?language=tr-TR` |
| `"search/movie"` | `{ query: "Kara Şövalye & Matrix", page: 2 }` | `.../3/search/movie?language=tr-TR&query=Kara+%C5%9E%C3%B6valye+%26+Matrix&page=2` |
| `"/discover/movie"` | `{ with_genres: 28, page: undefined, language: "en-US" }` | `.../3/discover/movie?language=en-US&with_genres=28` |

## Sözleşme

- Dosya ve export: `buildTmdbUrl.ts` → `buildTmdbUrl(path: string, params?: Record<string, string | number | undefined>): string`
- Testler dönen adresi ayrıştırarak taban adresi, yolu ve parametre anahtar-değer eşleşmelerini kontrol eder.
