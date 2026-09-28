Favori depolaması aynı filmi iki kez eklediğinde yinelenen id üretmemeli. Kalıcı yazımın anahtarını ve saklanan JSON değerini doğrula.

## Gereksinimler

- Test başlamadan localStorage içeriğini temizle.
- 550 id’si favoriteIds anahtarı altında JSON olarak saklanmalı.
- 550 iki kez eklendiğinde saklanan listede tek bir 550 bulunmalı.
- Spy test sonunda geri yüklenmeli.

## Örnek

İşlem: addFavorite(550), sonra addFavorite(550).
Beklenen anahtar: favoriteIds.
Beklenen JSON: [550].

## Sözleşme

- Yazılacak dosya: favoriteStore.test.ts
- Test edilecek modül: @impl/favoriteStore
- Çağrı: addFavorite(id: number): void
