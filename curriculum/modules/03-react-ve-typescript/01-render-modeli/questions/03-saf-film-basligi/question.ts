import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Saf film başlığı',
  difficulty: 'kolay',
  concepts: ['react.render-cycle', 'react.props', 'ts.functions'],
  files: ['MovieHeading.tsx'],
  hints: [
    '`year` boşken hangi parçanın kaybolması gerektiğine bak.',
    'Başlığı ayrı `<h2>` yap; yıl için koşullu JSX kullan.',
    '`year && <span>{year}</span>` ifadesini başlığın yanında kullan; props’u değiştirme.',
  ],
})
