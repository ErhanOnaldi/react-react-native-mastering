import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detaydan doğru yere dön',
  difficulty: 'orta',
  concepts: ['router.navigation', 'a11y.basics'],
  files: ['MovieNavigation.tsx'],
  hints: [
    '`Ara` için bağlantı, geri eylemi için düğme kullan.',
    '`Link to="/search"` ve düğmede `navigate(-1)` çağır.',
  ],
})
