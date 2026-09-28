Arama ekranının saf reducer'ı hazır. Bu reducer dış sisteme dokunmuyor; yalnızca verilen state ve action'dan yeni state üretiyor. Senin görevin, geçiş sözleşmesini `movieSearchReducer.test.ts` içinde davranış testleriyle kilitlemek.

## Gereksinimler

- Yeni sorgu yazıldığında durum `idle` olur, `query` yeni metne döner, eski sonuçlar temizlenir ve hata `null` olur.
- Arama başladığında durum `loading` olur; mevcut `query` korunur ve eski hata temizlenir.
- Başarılı cevapta durum `success` olur, gelen sonuçlar yazılır ve hata temizlenir.
- Hata cevabında durum `error` olur, sonuçlar temizlenir ve hata mesajı saklanır.
- Testler doğru implementasyonda geçmeli ve hatalı reducer sürümlerini yakalamalı.

## Örnek

| Önceki durum | Action | Beklenen |
| --- | --- | --- |
| `success`, query `"Dövüş"`, results `["Dövüş Kulübü"]` | `{ type: "typed", query: "Matrix" }` | `idle`, query `"Matrix"`, results `[]`, error `null` |
| `error`, error `"HTTP 500"` | `{ type: "started" }` | `loading`, error `null` |
| `loading`, query `"Matrix"` | `{ type: "succeeded", results: ["Matrix"] }` | `success`, results `["Matrix"]`, error `null` |

## Sözleşme

- Yazılacak dosya: `movieSearchReducer.test.ts`
- Import: `@impl/movieSearchReducer`
- Export'lar: `movieSearchReducer`, `initialMovieSearchState`, `MovieSearchState`
- Test ortamı: Vitest; `describe`, `it`, `expect` açık import edilmeli.

## Kısıtlar

- `impl/` altındaki reducer dosyasını değiştiremezsin.
- Ağ, timer veya React Testing Library gerekmez; bu görev saf fonksiyon testi.
