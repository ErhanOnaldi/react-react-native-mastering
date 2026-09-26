---
title: "Test verisi fabrikaları"
minutes: 7
kind: concept
---

# Test verisi fabrikaları

:::pain[Problem]
Üç kart testine aynı 16 alanlı TMDB nesnesini kopyaladın. poster_path boş vaka eklenince kopyalardan biri unutuldu.
:::

## Test verisinin temel biçimi

Bir test nesnesinde çok alan varsa senaryo için önemli birkaç alan kopyalar arasında kaybolur. Test data factory, geçerli bir varsayılan nesne üretir ve yalnız o senaryoya özgü alanların değiştirilmesine izin verir. Böylece testin niyeti okunur; varsayılan sözleşme değiştiğinde tek yer güncellenir. Her çağrının bağımsız nesne üretmesi test sızıntısını önler.

Sinema film fixture'ında `poster_path: null` gibi özel durum yalnız ilgili testte görünmelidir. MSW ile HTTP yanıtı kurarken de fabrika kullanılabilir. Zod modülünde aynı verinin gerçekten geçerli olup olmadığını şemayla doğrulayacaksın.

## İhtiyaç ve çözüm

`makeMovie(overrides: Partial<TmdbListMovie> = {})` geçerli varsayılan film üretir, sonra `...overrides` uygular. Testte yalnızca önemli fark görünür: `makeMovie({ poster_path: null })`.

Varsayılanlar TMDB biçimine sadık olmalı. `undefined` ve `null` farklı sözleşmelerdir. Bir sonraki pekiştirmede fabrika verisini MSW cevabında kullanacaksın.

## Sadece farkı oku

Testte bütün TMDB alanlarını tekrar yazdığında hangi alanın senaryo için önemli olduğu kaybolur. Fabrika geçerli başlangıç nesnesini tek yerde tutar; `Partial<TmdbListMovie>` yalnız değişen alanları kabul eder.

```ts title="makeMovie.ts"
function makeMovie(overrides: Partial<TmdbListMovie> = {}): TmdbListMovie {
  return { ...defaultMovie(), ...overrides }
}
const missingPoster = makeMovie({ id: 550, poster_path: null })
```

Buradaki `defaultMovie()` örnek bir varsayılan üreticidir; görevin çözümünde tüm zorunlu alanları kendin dolduracaksın. `poster_path: null`, "poster yok" demektir; `undefined` ise alanı hiç vermemek olabilir ve TMDB tipine uymaz. `release_date: ''` de gerçek fixture’larda karşılaşabileceğin boş tarih durumudur.

Her çağrıda yeni nesne ve `genre_ids` gibi mutable diziler için yeni dizi üret. Bir test listeye `99` eklediyse sonraki testin filmi değişmemeli. Son pratikte iki farklı film üretip handler cevabına koyarak query’nin gerçekten sonuca etki ettiğini göstereceksin.

:::mistake
`{ ...overrides, ...defaults }` sırası yanlış olur: varsayılanlar senaryonun özel alanlarını ezer. Override en sonda uygulanır.
:::

:::sector[Sektörde]
İyi test verisi yalnız gerekli farkı öne çıkarır. Geçerli varsayılanlar, yeni zorunlu TMDB alanı geldiğinde tek yerden güncellenir.
:::
