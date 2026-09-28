import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İlk rota ağacı',
  difficulty: 'kolay',
  concepts: ['router.setup', 'react.components'],
  files: ['routes.tsx'],
  hints: [
    'Önce iki ayrı adres için hangi başlıkların görünmesi gerektiğini eşleştir.',
    '`react-router` içinden route tanımları ve uygulama içi bağlantı için gereken API adlarına bak.',
    'Kök route içeriğine `Sinema` başlığı ile `/search` hedefli `Ara` bağlantısını, ikinci route içine `Film ara` başlığını yerleştir.',
  ],
})
