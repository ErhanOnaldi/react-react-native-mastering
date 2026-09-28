Film listesinde her kart için başlık ve yayın yılından oluşan birleşik bir etiket dizisi hazırlamak istiyoruz. `cardLabels` fonksiyonu, her film için başlık ve yılı birleştirmeli; tarihi boş olan filmlerde ise özelleştirilebilir bir yedek metin kullanmalıdır.

## Gereksinimler

- `MovieLabelInput` tipini tanımla ve export et: `title: string`, `release_date: string`.
- `cardLabels` fonksiyonu, `MovieLabelInput[]` dizisini ve isteğe bağlı bir `fallback` metnini (varsayılan: `'Tarih yok'`) kabul etmelidir.
- Her film için `"Başlık · Yıl"` formatında bir metin üretilmelidir.
- `release_date` dolu ise ilk 4 karakteri (yıl), boş (`""`) ise `fallback` değeri kullanılmalıdır.
- Sonuçlar orijinal dizi sırasını koruyan bir metin dizisi (`string[]`) olarak döndürülmelidir.

## Örnek

| Girdi (`movies`, `fallback`) | Çıktı |
| --- | --- |
| `([{ title: "Dövüş Kulübü", release_date: "1999-10-15" }])` | `["Dövüş Kulübü · 1999"]` |
| `([{ title: "Yeni film", release_date: "" }])` | `["Yeni film · Tarih yok"]` |
| `([{ title: "Yeni film", release_date: "" }], "Yakında")` | `["Yeni film · Yakında"]` |

## Sözleşme

- Dosya: `cardLabels.ts`
- Tip export: `type MovieLabelInput` (veya `interface MovieLabelInput`)
- Fonksiyon export: `cardLabels(movies: MovieLabelInput[], fallback?: string): string[]`
