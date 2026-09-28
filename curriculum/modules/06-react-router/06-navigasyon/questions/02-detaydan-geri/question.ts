import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detaydan doğru yere dön',
  difficulty: 'orta',
  concepts: ['router.navigation', 'a11y.basics'],
  files: ['MovieNavigation.tsx'],
  hints: [
    'Önceden bilinen `/search` hedefiyle önceki history kaydına dönme niyetini ayır.',
    '`Link` kullanıcı bağlantısı, `useNavigate` programatik geçiş içindir.',
    '`Ara` öğesini `/search` adresine bağla; `Aramaya dön` düğmesinde `navigate(-1)` çağır.',
  ],
})
