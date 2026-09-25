## Neden böyle?

Nesne tipi yapısaldır: fazladan alanları olan bir film değişkeni de gereken alanları sağlıyorsa kullanılabilir. İleride `Pick<Movie, ...>` ile bu küçük tipi türeteceğiz.

## Alternatif ve dikkat

Tam Movie tipini parametreye yazmak da çalışır; küçük sözleşme yeniden kullanımı kolaylaştırır. Puanı `Math.round` ile sayıya çevirirsen `8.0` gösterimi kaybolur.

## Sektörde ve devamında

Module 2’de `Pick` ile bu alt kümeyi ana Movie tipinden türeteceksin.
