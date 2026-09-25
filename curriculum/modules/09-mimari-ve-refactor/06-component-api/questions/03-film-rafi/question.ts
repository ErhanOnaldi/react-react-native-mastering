import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Controlled ve uncontrolled film rafı',
  difficulty: 'zor',
  concepts: ['arch.component-api', 'react.composition', 'react.props', 'react.state'],
  files: ['MovieShelf.tsx'],
  hints: [
    'Açık durumun kaynağına karar ver: `open` varsa dışarıdan gelir.',
    'İç state’i `defaultOpen` ile başlat; controlled modda onu okuma.',
    'Buton tıklamasında `onOpenChange(!visible)` çağır; yalnız uncontrolled modda iç state’i güncelle.',
  ],
})
