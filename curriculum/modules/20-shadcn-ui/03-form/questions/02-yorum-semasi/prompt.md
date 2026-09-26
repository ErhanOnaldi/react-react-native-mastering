`FormMessage` ekranda şemanın mesajını gösterir. Sinema'nın yorum şemasında mesaj verilmemiş kurallar var; kullanıcı puan seçmeden gönderince "Invalid input: expected number, received undefined" görüyor.

## Görev
`reviewSchema.ts` içindeki şemayı, her kuralın kullanıcıya **Türkçe ve anlaşılır** bir mesaj göstereceği şekilde tamamla. Zod 4'ün `error` parametresini kullan.

| Alan | Kural | Mesaj |
| --- | --- | --- |
| `body` | baş/son boşluk temizlenir, en az 1 karakter | `Yorum gerekli` |
| `body` | en fazla 500 karakter | `Yorum en fazla 500 karakter olabilir` |
| `rating` | yok ya da sayı değil | `Puan seç` |
| `rating` | tam sayı | `Puan tam sayı olmalı` |
| `rating` | 1 ile 5 arası | `Puan 1 ile 5 arasında olmalı` |

`ReviewValues` tipi şemadan türesin. Geçerli girdi temizlenmiş haliyle dönsün: `{ body: '  Harika  ', rating: 4 }` → `{ body: 'Harika', rating: 4 }`.

Bu şema sonraki görevde form parçalarına bağlanacak.
