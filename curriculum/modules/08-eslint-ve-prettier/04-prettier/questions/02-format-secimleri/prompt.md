# Sinema format seçenekleri

İki geliştirici aynı film listesini farklı biçimde kaydediyor. `formatOptions` nesnesini Prettier 3.9 Node API’sine vereceğiz.

| İstek | Seçenek |
| --- | --- |
| TypeScript ayrıştırıcısı | `parser: 'typescript'` |
| String’lerde tek tırnak | `singleQuote: true` |
| Satır sonunda noktalı virgül yok | `semi: false` |
| Satır genişliği hedefi | `printWidth: 80` |

`prettier.format` çıktı üretmeli; `Dövüş Kulübü` metni korunmalı. `printWidth` kesin üst sınır garantisi değildir; bu örnekte dizi uygun yerlerden bölünebilir.
