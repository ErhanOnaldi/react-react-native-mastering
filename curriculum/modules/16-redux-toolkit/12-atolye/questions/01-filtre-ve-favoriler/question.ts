import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtre ve favoriler',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'redux.slice', 'router.search-params'],
  files: ['MovieWorkspace.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Hangi bilginin paylaşılabilir olması, hangisinin yalnızca bu oturumda kalıcı olması gerektiğini ayır.',
    'Favori işaretini filmin kimliğine göre sakla, listedeki konumuna göre değil; tür veya sayfa değişse bile bu bilgiyi sıfırlama.',
    '`useSearchParams` ile tür ve sayfayı URL’de tut; favorileri film id’sine göre ayrı bir state’te (ör. bir `Set<number>`) yönet, TMDB isteğinden bağımsız kalsın.',
  ],
})
