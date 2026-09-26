import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Açılma mantığını hook’a çıkar',
  difficulty: 'kolay',
  concepts: ['pattern.headless', 'react.custom-hooks', 'react.state-snapshot', 'react.useCallback'],
  files: ['useDisclosure.ts'],
  hints: [
    '`useState(initial)` ile başla; `open` ve `close` state’i sabit `true`/`false` yapar.',
    '`toggle` eski render’ın değerini değil en güncel değeri tersine çevirmeli. Fonksiyonların referansını render’lar arasında sabit tutmak için hangi hook’u biliyorsun?',
    '`const toggle = useCallback(() => setIsOpen((value) => !value), [])`; `open` ve `close`’u da aynı şekilde `useCallback(..., [])` ile yaz.',
  ],
})
