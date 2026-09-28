import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'URL’den canlı film ara',
  difficulty: 'orta',
  concepts: [
    'router.search-params',
    'react.custom-hooks',
    'react.useEffect.deps',
    'fetch.loading-states',
  ],
  project: 'sinema',
  focusFiles: ['src/pages/SearchPage.tsx', 'src/hooks/useDebounce.ts'],
  reviewFiles: ['src/pages/SearchPage.tsx'],
  rubric: [
    'q URL’de tek kaynak',
    'Boş sorgu TMDB isteği atmıyor',
    'Sorgu değişince sayfa sıfırlanıyor',
  ],
  hints: [
    'Arama metnini ve sayfa numarasını doğrudan URL sorgu parametrelerinden türetmelisin; input değişiminde URL’yi güncellemek ve gereksiz istekleri geciktirmek ana hedeftir.',
    'URL senkronizasyonu için `useSearchParams` hook’unu, tuş vuruşlarını bekletmek için projedeki `useDebounce` hook’unu kullanabilirsin.',
    '`const [searchParams, setSearchParams] = useSearchParams()`; `const query = searchParams.get("q") ?? ""`; `const debouncedQuery = useDebounce(query.trim(), 350)`. Eğer `debouncedQuery` boşsa istek atmadan yönlendirme metnini göster; doluysa `tmdbFetch("/search/movie", { query: debouncedQuery, page })` çağrısı yap.',
    'Kullanıcı arama kutusunu her değiştirdiğinde `searchParams.delete("page")` çağrısı yapmayı unutursan, eski aramadan kalan yüksek sayfa numarası (ör. `page=4`) yeni aramada boş sonuç dönmesine neden olur.',
  ],
})
