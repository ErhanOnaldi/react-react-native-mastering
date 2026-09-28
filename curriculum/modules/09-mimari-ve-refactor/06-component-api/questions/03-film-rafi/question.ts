import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Controlled ve uncontrolled film rafı',
  difficulty: 'zor',
  concepts: ['arch.component-api', 'react.composition', 'react.props', 'react.state'],
  files: ['MovieShelf.tsx'],
  hints: [
    'İki kullanımda açık/kapalı durumunun sahibi aynı mı?',
    'Controlled/uncontrolled API kalıbı ve `ReactNode` tipine bak.',
    '`open !== undefined` ile modu seç; görünür değeri bundan türet, klikte callback çağır.',
    'Controlled modda yalnız owner prop değişince içerik değişsin; `aria-expanded` da aynı görünür değeri kullansın.',
  ],
})
