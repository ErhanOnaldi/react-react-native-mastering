import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Oturum izlerini temizle',
  difficulty: 'orta',
  concepts: [
    'auth.token-storage',
    'query.useQuery',
    'redux.store',
    'arch.state-categories',
    'js.destructuring',
  ],
  files: ['logout.ts'],
  hints: [
    'Çıkışı tek fonksiyonda koordine et: storage, store, Query cache.',
    'QueryClient API’sinde tüm cache’i kaldıran metot clear().',
    'Sadece token silmek eski kullanıcıya ait watchlist ve profil cache’ini bırakır.',
  ],
})
