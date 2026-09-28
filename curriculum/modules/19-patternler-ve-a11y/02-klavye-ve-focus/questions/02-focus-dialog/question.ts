import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Dialog odağını içeride tut',
  difficulty: 'orta',
  concepts: [
    'a11y.keyboard',
    'a11y.focus',
    'react.useEffect.cleanup',
    'react.useEffectEvent',
    'react.useId',
  ],
  files: ['FocusDialog.tsx'],
  hints: [
    'Focus akışını açılış, dialog içindeki sınırlar ve kapanış olarak ayır. Callback prop’u değişince focus yerinden oynamamalı.',
    '`useEffect`, `useEffectEvent`, `document.activeElement`, `focus()` ve `keydown` listener cleanup konularını gözden geçir.',
    'Açılışta önceki elementi sakla; Escape handler’ı güncel callback ile çağır. Tab sınırlarında `preventDefault()` sonrası karşı uca focus ver; cleanup listener’ı kaldırıp önceki elemana dön.',
  ],
  preview: { entry: 'Preview.tsx' },
})
