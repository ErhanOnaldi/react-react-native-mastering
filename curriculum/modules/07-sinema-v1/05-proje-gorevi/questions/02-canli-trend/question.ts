import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Ana sayfada haftalık trendi göster',
  difficulty: 'orta',
  concepts: ['fetch.basics', 'fetch.loading-states', 'react.useEffect.deps', 'react.context'],
  project: 'sinema',
  focusFiles: ['src/pages/HomePage.tsx', 'src/components/MovieGrid.tsx'],
  reviewFiles: ['src/pages/HomePage.tsx'],
  rubric: ['Ana sayfa statik örnekleri kullanmıyor', 'Loading, hata ve boş liste ayrılıyor'],
  hints: [
    'Bileşen bağlandığında (mount) bir kez çalışacak asenkron bir veri çekme akışı kurmalısın.',
    'Bileşende `useEffect` veya projedeki `useFetch` hook’unu kullanarak `/trending/movie/week` yoluna `tmdbFetch` isteği atabilirsin.',
    'Yanıtı sayfa state’inde tut; yükleme, hata ve başarılı sonuç durumlarını ayrı dallarda göster. Başarılı yanıttaki `results` listesini mevcut film ızgarasına aktar.',
    'Yükleme sırasında gereksinimde verilen Türkçe metni kullanıcıya durum mesajı olarak göster; statik film listesini veri kaynağı olarak bırakma.',
  ],
})
