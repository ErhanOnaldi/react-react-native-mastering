import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Route parametresi ve link',
  difficulty: 'orta',
  concepts: ['test.custom-render', 'router.params', 'router.navigation'],
  files: ['MovieRoute.tsx'],
  hints: [
    'useParams içinden id değerini al.',
    'Link bileşenini react-router’dan import et.',
    'id yoksa ayrı bir görünüm döndür.',
  ],
})
