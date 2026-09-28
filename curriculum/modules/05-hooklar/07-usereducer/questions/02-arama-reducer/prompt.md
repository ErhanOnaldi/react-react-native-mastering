Sinema aramasının bağlantılı alanları tek bir saf geçiş fonksiyonuyla yönetilecek. Verilen state ve action tiplerine göre `searchReducer` yeni state'i döndürsün.

## Gereksinimler

- Yeni sorgu geldiğinde `query` güncellenir, `page` 1 olur, `results` temizlenir ve `error` `null` olur.
- İstek başlarken `loading` `true` olur ve eski hata temizlenir.
- Başarıda gelen sonuçlar yazılır, `loading` kapanır.
- Hatada hata mesajı saklanır, `loading` kapanır.
- Sonraki sayfa action'ı `page` değerini 1 artırır.
- Fonksiyon aynı girdiye aynı sonucu döndürür; dış sistemlere dokunmaz.

## Örnek

| Önceki state | Action | Beklenen |
| --- | --- | --- |
| `page: 3`, `results: ["Eski"]` | `{ type: "query", value: "Matrix" }` | `query: "Matrix"`, `page: 1`, `results: []`, `error: null` |
| `loading: true` | `{ type: "success", results: ["Matrix"] }` | `loading: false`, `results: ["Matrix"]` |

## Sözleşme

- Dosya ve export: `searchReducer.ts` → `searchReducer`, `initialState`
- Hazır tipler: `State`, `Action`
- Testler reducer'ı doğrudan import eder.
