---
title: "Memo gerçekten ne zaman gerekir?"
minutes: 9
kind: concept
---

# Memo gerçekten ne zaman gerekir?

:::pain[Problem]
Bir tuşla 500 film için pahalı puan hesabı tekrarlandı. Önce hesaplamayı say; sonra referans eşitliğinin neden önemli olduğunu gör.
:::

## Tekrar yapılan işi seçici azalt

`memo` aynı props alan component render'ını atlamayı, `useMemo` hesaplanan değeri, `useCallback` fonksiyon referansını korumayı amaçlar. Bunlar doğruluk kuralları değil performans araçlarıdır; bağımlılıklar yanlışsa eski veri gösterebilirler. Ayrıca her render'da yeni nesne veya fonksiyon vermek referans eşitliğini bozabilir.

Sinema'nın 500 kartlı listesinde pahalı hesap gerçekten ölçüldüyse bu araçların etkisi görülebilir. Önceki render nedenleri dersinde belirlediğin sınırı hedefle. Sonraki React Compiler dersinde aynı optimizasyonun daha otomatik yolu ele alınacak.

## Üç ayrı araç
`memo` aynı props ile çocuk render'ını atlayabilir. `useMemo` pahalı hesaplamanın sonucunu bağımlılıkları değişene kadar tutar. `useCallback` fonksiyon referansını sabit tutar; tek başına iş hızlandırmaz.

Bir `memo(MovieCard)`'a her render'da yeni `onClick={() => ...}` verirsen props eşitliği bozulur. Önce Profiler ve `vi.fn` ile farkı ölç. Film verisi gerçekten değiştiğinde yeni sonucu göstermeyi unutma.

:::tip
Modül 5'te öğrendiğin 'gereksiz yere memo ekleme' kuralı hâlâ geçerli. Burada ölçülen pahalı hesaplama ve büyük çocuk ağacı var.
:::

## Referansın küçük farkı

```tsx title="MoviePanel.tsx"
const ranked = useMemo(() => rank(movies), [movies, rank])
const choose = useCallback((id: number) => setSelectedId(id), [])
return ranked.map((movie) => <MemoMovieCard key={movie.id} movie={movie} onChoose={choose} />)
```

Buradaki `rank` gerçekten pahalıysa ve `movies` aynı referansta kalıyorsa hesap atlanır. Parent her render'da `movies={[...movies]}` gönderirse dependency değişir; bu durumda memo'nun faydası kaybolur. `useCallback` içindeki `setSelectedId` setter'ı kararlıdır; fakat `selectedId` okunuyor olsaydı dependency gerekir ya da updater biçimi seçilirdi.

`vi.fn(rank)` ile tema değişiminde sıfır ek çağrı, yeni film geldiğinde bir ek çağrı bekle. Yalnız daha az çağrı değil, doğru film sırası da test edilmelidir.
