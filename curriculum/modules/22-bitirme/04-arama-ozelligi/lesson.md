---
title: "Arama: URL, önbellek ve kirli veri bir arada"
minutes: 10
kind: project
---

# Arama: URL, önbellek ve kirli veri bir arada

:::pain[Problem]
Sinema’da arama her tuşta (debounce ile) TMDB’ye gidiyordu; TMDB’nin kotası boldu, cevabı 100 ms’de geliyordu. Open Library farklı: gönüllülerin işlettiği ücretsiz bir servis, cevap 1–3 saniye sürebiliyor ve `total_pages` yok, sadece `numFound: 48232` var.

İlk içgüdün 7. modüldeki gibi `useEffect` + `fetch` yazmak olabilir. Aynı acıları hatırla: sayfa değişince liste boşalıp zıplıyordu, aramaya geri dönünce aynı istek yeniden gidiyordu, `?page=abc` sayfayı bozuyordu. Bu sefer çözümleri biliyorsun; mesele onları **tek bir temiz akışta** birleştirmek.
:::

Bu dersteki her parça daha önce gördüğün bir kavram, ama her biri yeni bir kıvrımla geliyor.

| Kavram | Nerede gördün | Kitaplık’taki yeni kıvrım |
| --- | --- | --- |
| URL state | 6. modül | Arama **form gönderilince** URL’ye yazılır; yazarken değil |
| `queryOptions` + key | 12. modül | Key’de `q` **ve** `page`; boş sorguda sorgu kapalı |
| `keepPreviousData` | 12. modül | Yavaş API’de sayfa geçişi zıplamasın |
| Zod ile API doğrulama | 15. modül | Doğrularken **dönüştür**: snake_case → uygulamanın kendi modeli |
| `key` ile sıfırlama | 5. modül | Kontrolsüz input’u URL’yle senkron tutmak |

## Form mu, debounce mu?

| | Her tuşta (debounce) | Form gönderilince |
| --- | --- | --- |
| İstek sayısı | Yazdıkça, duraksadıkça | Kullanıcı istediğinde bir kez |
| Tarayıcı geçmişi | Her ara adım bir kayıt olabilir | Her arama bir kayıt |
| Uygun olduğu API | Hızlı, bol kotalı (TMDB) | Yavaş, paylaşımlı, ücretsiz (Open Library) |

Gereksinimler (K-1) kararı zaten vermiş: form gönderilince. Böylece “arama kutusundaki taslak” ile “URL’deki kararlı sorgu” da ayrılıyor. Taslak DOM’da yaşar (kontrolsüz input), kararlı sorgu URL’de.

## URL’yi tek doğruluk kaynağı yap

URL’den gelen her değer kullanıcı girdisidir: `?page=abc`, `?page=-3`, `?q=%20%20`. Okurken **bir kez** temizle, uygulamanın geri kalanı temiz değerle çalışsın:

```ts check
/** URL → arama durumu. Bozuk page değeri 1'e düşer. */
export function readSearchParams(searchParams: URLSearchParams) {
  const q = searchParams.get('q')?.trim() ?? ''
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10)
  return { q, page: Number.isInteger(page) && page > 0 ? page : 1 }
}

readSearchParams(new URLSearchParams('q=%20dune%20&page=abc')) // { q: 'dune', page: 1 }
```

Arama kutusu ise URL’den **beslenir** ama her tuşta URL’ye yazmaz. Kontrolsüz bir input ile `key={q}` bunu tek satırda çözer: URL’deki sorgu değiştiğinde (geri tuşu, paylaşılan link) React input’u yeni `defaultValue` ile baştan kurar.

```tsx
<input key={q} name="q" type="search" defaultValue={q} aria-label="Kitap ara" />
```

Gönderimde değeri `FormData` ile al, **boşlukları at**, boşsa hiçbir şey yapma; doluysa `navigate('/search?q=…')`. Yeni arama `page`’i URL’ye hiç yazmaz, yani kendiliğinden 1. sayfaya döner.

## Veriyi kapıda dönüştür

Open Library’nin alan adları (`author_name`, `first_publish_year`, `cover_i`) ve eksik alanları uygulamanın her köşesine yayılmasın. Zod şeması hem **doğrular** hem de uygulamanın kendi modeline **dönüştürür**:

```ts check
import { z } from 'zod'

const searchDocSchema = z
  .object({
    key: z.string(), // "/works/OL893414W"
    title: z.string(),
    author_name: z.array(z.string()).optional(),
    first_publish_year: z.number().optional(),
    cover_i: z.number().optional(),
  })
  .transform((doc) => ({
    id: doc.key.split('/').at(-1) ?? doc.key,
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
  }))

export const searchResponseSchema = z
  .object({ numFound: z.number(), docs: z.array(searchDocSchema) })
  .transform((r) => ({ total: r.numFound, books: r.docs }))

export type BookSummary = z.output<typeof searchDocSchema>
// { id: string; title: string; authors: string[]; firstPublishYear: number | null; coverId: number | null }
```

Artık bileşenler `book.coverId === null` diye tek bir şeyi kontrol eder; “alan yok mu, `undefined` mı, `0` mı?” sorusu kapıda cevaplandı. Bu, 9. modüldeki tipli API client’ın bir adım ötesi: tipler artık **çalışma zamanında da** doğru.

## Sorgu: key’de ne varsa ekranda o var

```tsx check
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

interface SearchParams {
  q: string
  page: number
}

async function searchBooks({ q, page }: SearchParams, signal: AbortSignal) {
  const url = new URL('https://openlibrary.org/search.json')
  url.search = new URLSearchParams({ q, page: String(page), limit: '10' }).toString()
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Open Library ${response.status}`)
  return (await response.json()) as { numFound: number }
}

export const bookQueries = {
  search: (params: SearchParams) =>
    queryOptions({
      queryKey: ['books', 'search', params] as const,
      queryFn: ({ signal }) => searchBooks(params, signal),
      staleTime: 5 * 60_000, // aynı arama 5 dk içinde tekrar istenmez (API nezaketi)
    }),
}

export function useBookSearch(params: SearchParams) {
  return useQuery({
    ...bookQueries.search(params),
    enabled: params.q.length > 0, // boş sorguda istek yok
    placeholderData: keepPreviousData, // sayfa değişirken eski liste ekranda kalır
  })
}
```

Toplam sayfa sayısını sen hesaplıyorsun: `Math.ceil(total / 10)`. 48.232 sonuç Türkçe biçimde `total.toLocaleString('tr-TR')` ile “48.232” olur.

Sayfalamayı **link** olarak yap (`<Link to="/search?q=dune&page=2">`): yeni sekmede açılabilir, kopyalanabilir. Pasif olan kontrolü ya hiç gösterme ya da `aria-disabled="true"` ile işaretle.

:::mistake
Sayfa numarasını `useState`’te tutup sadece “Sonraki”ye basınca artırmak. Link paylaşılınca 1. sayfa açılır, geri tuşu sayfayı değil başka bir aramayı geri getirir. Bir de tersi: `page`’i URL’ye yazıp **query key’e koymamak** — ekranda 1. sayfanın verisiyle “Sayfa 2” yazar.
:::

:::sector
Herkese açık bir API’yi kullanmak, kurallarını okumayı da içerir: istek sınırları, önerilen parametreler (Open Library’de `fields` ile sadece gereken alanları istemek), önbellek beklentileri. Gerçek projelerde bu kurallar bir “API kullanım” ADR’sine ya da README’ye yazılır; ihlal eden bir istemci engellenebilir.
:::
