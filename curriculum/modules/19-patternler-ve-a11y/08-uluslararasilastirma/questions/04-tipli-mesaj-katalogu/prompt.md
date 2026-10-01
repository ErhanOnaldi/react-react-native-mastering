Türkçe ve İngilizce Sinema arayüzlerinde film sayısını ve selamlamayı aynı yerden üret. Her mesaj türü yalnızca kendi ihtiyaç duyduğu bilgiyi kabul etsin.

## Gereksinimler
- `movieCount` mesajı `count` sayısını alsın; Türkçede `1 film`, `3 film`, İngilizcede `1 movie`, `3 movies` üretsin.
- `welcome` mesajı `name` adını alsın ve seçili dilde selamlama üretsin.
- İki mesaj türü ayırt edici `key` alanıyla tanımlansın; her tür yalnızca kendi parametresini taşısın.
- Olmayan mesaj anahtarı ve mesaj türüne ait olmayan parametre TypeScript tarafından reddedilsin.

## Örnek

| Mesaj | Dil | Sonuç |
| --- | --- | --- |
| `{ key: 'movieCount', count: 3 }` | Türkçe | `3 film` |
| `{ key: 'movieCount', count: 1 }` | İngilizce | `1 movie` |
| `{ key: 'welcome', name: 'Ada' }` | İngilizce | `Welcome, Ada` |

## Sözleşme
- Dosya ve export: `messages.ts` içinden `t(message: Message, locale: Locale): string`.
- `messages.ts` içinden `Message` ve `Locale` tipleri de dışa aktarılır.
- `Message` iki biçimden biridir: `{ key: 'movieCount'; count: number }` veya `{ key: 'welcome'; name: string }`.
- `locale`, `tr` veya `en` değerini alır.
