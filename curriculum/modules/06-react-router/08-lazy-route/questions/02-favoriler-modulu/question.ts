import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Favoriler route modülünü geç yükle',
  difficulty: 'orta',
  concepts: ['router.lazy', 'js.modules', 'react.components'],
  files: ['FavoriteRoute.tsx'],
  hints: [
    'Data mode lazy modülünün export adını hatırla.',
    '`export function Component()` yaz ve sayfa içeriğini döndür.',
  ],
})
