import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İlk rota ağacı',
  difficulty: 'kolay',
  concepts: ['router.setup', 'react.components'],
  files: ['routes.tsx'],
  hints: ['Önce iki `path` tanımla.', 'Kök route `element` içinde `Link to="/search"` kullan.'],
})
