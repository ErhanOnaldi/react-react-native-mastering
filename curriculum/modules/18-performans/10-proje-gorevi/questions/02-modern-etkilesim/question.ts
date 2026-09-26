import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Favori, lazy route ve Compiler',
  difficulty: 'zor',
  concepts: [
    'react.useOptimistic',
    'react.actions',
    'perf.code-splitting',
    'perf.compiler',
    'router.lazy',
  ],
  project: 'sinema',
  focusFiles: [
    'src/features/favorites/components/OptimisticFavoriteButton.tsx',
    'src/router.tsx',
    'vite.config.ts',
  ],
  reviewFiles: [
    'src/features/favorites/components/OptimisticFavoriteButton.tsx',
    'src/router.tsx',
    'vite.config.ts',
  ],
  hints: [
    'Kaydedilmiş favori durumu ile istek sürerken görünen durumun ilişkisini düşün.',
    '`useOptimistic` ile görünen durumu yönet; Action sırasında `addOptimistic(next)` çağır.',
    'Hata durumunda temel state eski değerde kalmalı; pending sırasında düğmeyi devre dışı bırak.',
  ],
  rubric: [
    'Detay route `lazy` fonksiyonu kullanıyor ve route modülü Component export ediyor.',
    'Vite 8/@vitejs/plugin-react 6 için kararlı Babel compiler yolu etkin; deneysel `compiler: true` kullanılmıyor.',
    "Async favori işlemi mevcut Redux/Query state'iyle tutarlı, başarısızlıkta geri alınıyor.",
  ],
})
