import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama formu',
  difficulty: 'kolay',
  concepts: ['react.events', 'react.controlled-input'],
  files: ['SearchForm.tsx'],
  hints: [
    'Formun varsayılan submit davranışını durdur; boş aramayı ayır.',
    '`FormEvent<HTMLFormElement>` handler’ında `preventDefault()` ve `trim()` kullan.',
    'Kırpılmış değer boş değilse `onSearch(clean)` çağır; input state’ini değiştirmek zorunda değilsin.',
  ],
})
