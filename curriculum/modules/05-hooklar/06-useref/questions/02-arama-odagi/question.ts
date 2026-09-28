import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Arama kutusuna odaklan',
  difficulty: 'orta',
  concepts: ['react.useRef', 'react.events'],
  files: ['SearchFocus.tsx'],
  hints: [
    'Odak, ekranda gösterilen veri değil; DOM düğümünde yaşayan bir durum.',
    'DOM düğümüne ulaşmak için `useRef<HTMLInputElement>(null)` kullan.',
    'Input’a `ref={inputRef}` ver; düğmenin `onClick` içinde `inputRef.current?.focus()` çağır.',
  ],
})
