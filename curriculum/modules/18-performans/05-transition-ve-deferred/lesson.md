---
title: "Yazmayı önceliklendir"
minutes: 9
kind: concept
---

# Yazmayı önceliklendir

:::pain[Problem]
Sıralamayı azalttın ama filtrelenen 500 satırı ekrana koymak hâlâ inputu bekletiyor. Her tuşun görünmesi acil, liste güncellemesi bekleyebilir.
:::

## İki ihtiyaç
`useDeferredValue(query)` pahalı listeye gecikmeli bir değer geçirir; input güncel `query` ile controlled kalır. `useTransition` ise açıkça başlattığın state güncellemesini düşük öncelikle işler ve `isPending` verir. Transition içindeki controlled input state'ini erteleme.

Deferred sonuç eski sorguyu gösterirken `query !== deferredQuery` ile 'Güncelleniyor' gösterebilirsin. Bu bir debounce değildir: ağ isteği sayısını kısıtlamaz. TMDB aramasında mevcut debounce/query cache ihtiyacı sürer.

:::mistake
Gecikmeyi `setTimeout` ile taklit eden testler scheduling davranışını doğrulamaz. Burada inputun hemen doğru değeri göstermesini, listenin sonunda yeni sonucu göstermesini sınayacağız.
:::

## İki ayrı akış

```tsx title="SearchPage.tsx"
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
return <><input value={query} onChange={(e) => setQuery(e.target.value)} />
  <MovieResults query={deferredQuery} /></>
```

Inputun `value` prop'u deferred olsaydı yazdığın harf de beklerdi. Oyuncu sekmesinde ise ayrı bir state güncellemesini `startTransition(() => setTab('cast'))` ile başlatırsın. Transition'ın `isPending` değeri beklemeyi gösterebilir. Her ikisinde de render işi tamamen yok olmaz; acil işin önüne geçmesi azaltılır. 500 kartı DOM'a koyma sorunu sonraki derste ayrıca çözülecek.
