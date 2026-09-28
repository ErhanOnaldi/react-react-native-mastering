Sinema aramasında bekleme, boş sonuç, başarılı sonuç ve hata aynı metinle gösterilmemeli. `Status` bileşeni kendisine verilen sonucu kullanıcıya doğru durum metniyle anlatsın.

## Gereksinimler

- İstek başlamadan önce `Aramaya başla` metni görünür.
- İstek sürerken `Yükleniyor` metni görünür.
- Başarılı ama boş listede `Sonuç yok` metni görünür.
- Başarılı ve dolu listede film sayısı `N film` biçiminde görünür.
- Hata durumunda `Hata: <açıklama>` metni görünür.

## Örnek

| Prop | Görünen metin |
| --- | --- |
| `{ status: "idle" }` | `Aramaya başla` |
| `{ status: "success", data: ["A", "B"] }` | `2 film` |
| `{ status: "error", error: "Bağlantı yok" }` | `Hata: Bağlantı yok` |

## Sözleşme

- Dosya ve export: `Status.tsx` → `Status`
- Prop tipi: `result: RemoteData<string[]>`
- Testler ekranda yukarıdaki metinleri arar.
