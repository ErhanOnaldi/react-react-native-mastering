import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Aktif menüyü göster',
  difficulty: 'orta',
  concepts: ['router.navigation', 'a11y.basics'],
  files: ['Menu.tsx'],
  hints: [
    "Etkinlik bilgisini router'dan alan bağlantı bileşenini seç.",
    '`NavLink` ve kök bağlantısında `end` kullan.',
  ],
})
