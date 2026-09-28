import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Favoriler route modülünü geç yükle',
  difficulty: 'orta',
  concepts: ['router.lazy', 'js.modules', 'react.components'],
  files: ['FavoriteRoute.tsx'],
  hints: [
    'Route modülünün export ettiği bileşenin Router tarafından hangi alan adıyla bulunacağını hatırla.',
    'Data mode route `lazy` alanı dinamik import ile modül route alanlarını çözümler.',
    '`export function Component()` içinde Favoriler başlığını ve `/` hedefli Ana sayfa linkini döndür.',
  ],
})
