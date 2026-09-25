import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'id değişince filmi yenile',
  difficulty: 'orta',
  concepts: ['react.useEffect.deps', 'react.props', 'fetch.headers-auth'],
  files: ['MovieDetails.tsx'],
  hints: [
    '`id` effect içinde okunuyor.',
    'Effect dış sistemde hangi filmi temsil ediyor?',
    'Dependency array’i `[id]` yap.',
  ],
})
