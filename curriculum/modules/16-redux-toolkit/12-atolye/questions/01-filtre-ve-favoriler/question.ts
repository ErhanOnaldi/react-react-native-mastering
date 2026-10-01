import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtre ve favoriler',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'router.search-params', 'redux.server-vs-client'],
  files: ['MovieWorkspace.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Hangi bilginin paylaşılabilir olması, hangisinin yalnızca bu oturumda kalıcı olması gerektiğini ayır.',
    'Favori işaretini filmin kimliğine göre sakla, listedeki konumuna göre değil; tür veya sayfa değişse bile bu bilgiyi sıfırlama.',
    '`useSearchParams` ile tür ve sayfayı URL’de tut; film listesini Query’de bırak. Favoriler yalnız bu ekranda kullanılıyorsa Redux store gerekli mi, sen karar ver.',
  ],
  rubric: [
    'Tür ve sayfa URL’den okunur; seçim değişince URL güncellenir.',
    'TMDB sonuçları server state olarak alınır; loading ve error durumu görünürdür.',
    'Favori işareti film ID’sine bağlıdır ve tür/sayfa değişiminde korunur.',
    'Redux gereksinimi, state’in başka ekranlarla paylaşılıp paylaşılmadığına göre değerlendirilir; tek ekrana ait state için gereksiz global kurulum yapılmaz.',
  ],
})
