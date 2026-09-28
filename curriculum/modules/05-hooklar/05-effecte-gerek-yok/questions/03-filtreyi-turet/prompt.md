Film listesi ve arama metni zaten prop olarak geliyor. `MovieFilter`, aynı render içinde bu iki girdiye uyan başlıkları göstermeli; eski filtrelenmiş liste kısa süreliğine bile görünmemeli.

## Gereksinimler

- İlk render'da yalnızca sorguya uyan başlıklar listelenir.
- `query` değiştiği render'da eski eşleşmeler ekranda kalmaz.
- Eşleşme Türkçe büyük/küçük harf kurallarına uygun yapılır.
- Liste öğeleri kararlı bir anahtarla render edilir.

## Örnek

| `titles` | `query` | Görünen |
| --- | --- | --- |
| `["Dövüş Kulübü", "Matrix"]` | `"mat"` | `Matrix` |
| `["Dövüş Kulübü", "Matrix"]` | `"döv"` | `Dövüş Kulübü` |

## Sözleşme

- Dosya ve export: `MovieFilter.tsx` → `MovieFilter`
- Prop: `{ titles: string[]; query: string }`
- Testler liste metinlerini doğrudan ekranda arar.
