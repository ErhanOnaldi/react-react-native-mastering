import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Pahalı sıralamayı önbelleğe al',
  difficulty: 'orta',
  concepts: ['perf.memo', 'react.useMemo', 'js.array-methods', 'test.mocks'],
  files: ['RankedMovies.tsx'],
  hints: [
    'Hangi props sıralamanın sonucunu etkiler?',
    'Hesaplamayı `useMemo` içinde yap; dependency listesini sonuç girdilerinden kur.',
    '`useMemo(() => rank(movies), [movies, rank])` kullan.',
  ],
})
