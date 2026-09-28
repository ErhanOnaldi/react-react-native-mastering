Türkçe ve İngilizce arayüzlerde aynı mesajı tutarlı göstermek için anahtarları ve gereken parametreleri doğrulayan bir metin yardımcısı yaz.

## Gereksinimler
- Türkçe ve İngilizce metin katalogları aynı mesaj anahtarlarını içersin.
- `movieCount` mesajı sayıyı alsın; Türkçede `1 film`, `3 film`, İngilizcede `1 movie`, `3 movies` üretsin.
- `welcome` mesajı adı alsın ve seçili dilde selamlama üretsin.
- Bilinmeyen anahtar veya eksik/yanlış parametre TypeScript tarafından reddedilsin.

## Örnek

| Anahtar | Parametre | Dil | Sonuç |
| --- | --- | --- | --- |
| `movieCount` | `{ count: 3 }` | Türkçe | `3 film` |
| `movieCount` | `{ count: 1 }` | İngilizce | `1 movie` |
| `welcome` | `{ name: 'Ada' }` | İngilizce | `Welcome, Ada` |

## Sözleşme
- Dosya ve export: `messages.ts` içinden `t<K extends MessageKey>(key: K, params: MessageParams<K>, locale: Locale): string`.
- `key`, `movieCount` veya `welcome`; `locale`, `tr` veya `en` değerini alır.
- Parametre biçimi anahtara göre değişir: `movieCount` için `{ count: number }`, `welcome` için `{ name: string }`.
