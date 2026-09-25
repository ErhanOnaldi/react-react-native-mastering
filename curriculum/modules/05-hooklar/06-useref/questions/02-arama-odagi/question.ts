import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Arama kutusuna odaklan',
  difficulty: 'orta',
  concepts: ['react.useRef', 'react.events'],
  files: ['SearchFocus.tsx'],
  hints: [
    'DOM düğümüne ulaşmak için ref kullan.',
    'Input’a `ref={inputRef}` ver.',
    'Düğmenin `onClick` içinde `inputRef.current?.focus()` çağır.',
  ],
})
