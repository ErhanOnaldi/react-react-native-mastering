import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'id değişince filmi yenile',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'react.props', 'fetch.headers-auth'],
  files: ['MovieDetails.tsx'],
  hints: [
    'İlk film geliyor; sorun aynı bileşen açıkken prop değiştiğinde ortaya çıkıyor.',
    'Effect dış sistemde hangi filmi temsil ediyorsa o reactive değer dependency olmalı.',
    'Bu görevde effect gövdesi `id` okuyor; dependency listesi `[id]` olmalı.',
  ],
})
