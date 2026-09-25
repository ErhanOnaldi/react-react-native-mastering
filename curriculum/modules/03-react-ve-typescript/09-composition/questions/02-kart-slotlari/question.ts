import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kart slot’ları',
  difficulty: 'kolay',
  concepts: ['react.composition', 'react.children'],
  files: ['MoviePanel.tsx'],
  hints: [
    'Kart çerçevesi hangi içeriği kendi üretmek zorunda değil?',
    '`children` ana içerik, `actions` isteğe bağlı alt bölge olsun.',
    '`article` içinde children göster; actions varsa `<footer>{actions}</footer>` ekle.',
  ],
})
