# Film seçimine göre mesajı göster

Seçili film yokken `MovieNotice` “Film seç” mesajını göstermeli. Film seçilince sayfa başlığı ve `Film {id}` metni görünmeli; Hook sırası her render’da aynı kalmalı.

## Gereksinimler

- `id` boşken “Film seç” çıktısı korunur.
- `id` varken `document.title` ve `<p>Film {id}</p>` güncellenir.
- Hook koşula bağlı çağrılmamalı ve lint hatası kalmamalıdır.

## Örnek

`id = null` → `Film seç`; `id = '155'` → `Film 155` ve belge başlığı `155`.

## Sözleşme

- Dosya: `hookSource.ts` içindeki `hookSource` adlı string dışa aktarımı.
- String, `MovieNotice({ id: string | null })` bileşeninin lint edilecek TSX kaynağıdır.

## Kısıtlar

- İki görünür durumun metnini ve belge başlığı güncellemesini koru.
