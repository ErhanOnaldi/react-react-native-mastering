---
title: "Acıyı ölç: Profiler"
minutes: 8
kind: concept
---

# Acıyı ölç: Profiler

:::pain[Problem]
Sinema aramasında 500 kart varken bir harfe basınca input takılıyor. 'Yavaş' demek yeterli değil: kaç commit olduğunu görmen gerekiyor.
:::

## Performansın farklı maliyetleri

Performans, yalnız kodun az satır olması değil, kullanıcının eylemine uygulamanın verdiği süredir. React tarafında render ve commit sayısı, hesaplama maliyeti ve DOM boyutu farklı darboğazlar yaratır. Profiler belirli bir alt ağacın commit'lerini gözlemlemeye yardım eder; ölçüm karşılaştırılabilir koşullarda yapılmalıdır.

Sinema'nın büyük arama listesi tek bir belirti gösteriyor: yazarken takılma. Önceki state ve render modeli dersleri, bu belirtinin nereden doğabileceğini anlatmıştı. Bu modül her değişiklikte aynı akışı ölçerek varsayımdan kanıta geçecek.

## Önce ölç
`Profiler`, bir alt ağacın commit edildiği an `onRender(id, phase, actualDuration)` çağırır. Geliştirme ve production süreleri aynı değildir; önce commit sayısını ve hangi etkileşimde arttığını gözle. `StrictMode` geliştirmede fazladan render yapabilir.

## Deney
Bir `Profiler` ile yalnızca film listesini sar; callback çağrılarını say. Input için ayrı bir bölge düşün. Büyük süre görürsen hangi işin tekrarlandığını sonraki derste ayıracağız.

:::sector
Chrome React Performance Tracks ve React DevTools Profiler, gerçek uygulamada bileşenleri görmeyi sağlar. Testte ise süre eşiği koymak yerine çağrı sayısını say: makine hızı değişir.
:::

## Aynı tuşu iki kez ölç

Önce boş listede, sonra 500 filmde tek harf yaz. `Profiler` callback'inde `phase` ilk gösterimde `mount`, sonraki commit'lerde `update` olur. İki durumda input aynı, değişen yalnız liste boyutudur. Böylece gecikmeyi ağ isteğiyle karıştırmazsın: mevcut TanStack Query cache'i sıcak olsa da render işi sürebilir.

```tsx title="ListeÖlçümü.tsx"
<Profiler id="movie-list" onRender={onListCommit}>
  <MovieList movies={movies} />
</Profiler>
```

Callback içinde ölçümü dışarı aktar. Aynı ağacın state'ini her commit'te artırırsan yeni commit üretip ölçümü bozabilirsin. Önizleme sayacı bu yüzden ölçülen listenin dışında durur.
