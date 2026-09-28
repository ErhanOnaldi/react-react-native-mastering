import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Pahalı sıralamayı sakla',
  difficulty: 'orta',
  concepts: ['perf.memo', 'react.useMemo', 'perf.rerender'],
  files: ['RankedMovies.tsx'],
  hints: [
    'Bileşen her render olduğunda içindeki hesaplama fonksiyonunun doğrudan çağrılmasını nasıl önleyebilirsin?',
    'Hesaplanan değeri bağımlılıkları değişene kadar bellekte tutmak için `useMemo` kullanılır.',
    '`const result = useMemo(() => rank(movies), [movies, rank])` yapısını kullan.',
    '`[movies]` bağımlılığıyla birlikte gelen `rank` prop’unu da bağımlılık dizisine eklemeyi unutma; aksi halde linter uyarı verir.',
  ],
})
