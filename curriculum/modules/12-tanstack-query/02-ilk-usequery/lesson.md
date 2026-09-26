---
title: "İlk useQuery"
minutes: 8
kind: concept
---

# İlk useQuery

:::pain[Problem]
Detay sayfasından aramaya dönünce aynı sonuç yeniden yükleniyor. Ayrıca her sayfa `loading`, `error` ve `data` state’ini kendisi tutuyor.
:::

## Sunucu verisinin yaşamı

Sunucudan okunan veri, tek bir component'in yerel state'inden farklıdır: aynı bilgi birkaç ekranda kullanılabilir, zamanla bayatlar ve tekrar istenebilir. TanStack Query bu veriyi bir **query** olarak yönetir; sonucu, isteğin durumunu ve cache ömrünü takip eder. `useQuery` veriyi okumak için, `QueryClient` ise ortak cache'i yönetmek için vardır.

Effect dersinde istek başlatmayı ve eski cevabı engellemeyi, testlerde ağ sınırını kurmayı öğrendin. Sinema'daki tekrarlı GET bu ihtiyaçların birleştiği yer. Query kullanınca hangi verinin sunucuya ait olduğu ile arama kutusunun geçici metni gibi yerel bilgileri ayırman gerekir.

## Ortak sahip: QueryClient

`QueryClient` sunucu verisinin cache’ini tutar. `QueryClientProvider` onu React ağacına verir; uygulamada bir istemci kurulur. Hook’u bileşenin içinde çağırırsın. Testte ise **her test için yeni** istemci oluşturursun.

```tsx title="src/SearchResults.tsx"
import { useQuery } from '@tanstack/react-query'
import { searchMovies } from '@/features/movies/api/movies-api'

function SearchResults() {
  const result = useQuery({
    queryKey: ['movies', 'search', 'Matrix'],
    queryFn: () => searchMovies({ query: 'Matrix', page: 1 }),
    staleTime: 60_000,
  })
  if (result.isPending) return <p>Yükleniyor</p>
  if (result.isError) return <p>Hata: {result.error.message}</p>
  return <p>{result.data.results.length} film</p>
}
```

`searchMovies`, Sinema v2’deki mevcut API fonksiyonudur. `queryFn` Promise döner; kimlik `queryKey` ile belirlenir. Başarıdan sonra bir dakika içinde aynı key ile geri dönersen cache verisi taze sayılır ve yeni GET gerekmez. Varsayılan `staleTime: 0` iken veri hemen stale olur; cache olsa bile mount sırasında arka planda refetch görebilirsin.

## Durumları oku

`status`, `pending | error | success` ayrımlı bir union’dır. `isPending` ilk veri yokken beklemeyi anlatır; `isFetching` arka plan isteğinde de true olabilir. Eski veri görünürken küçük bir yenileme göstergesi için `isFetching` uygundur.

:::mistake
Query sonucunu `useState` içine kopyalama. İki ayrı kaynağı eşitlemek zorunda kalırsın. Sunucudan gelen veri Query cache’inde, kullanıcı girişi ve URL ayrı yerlerde yaşasın.
:::
