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
    'Açılış anında `document.activeElement`’i effect içinde bir değişkende sakla ve Oynat’a focus ver; cleanup’ta o öğeye geri dön.',
    'Keydown dinleyicisinde Tab sınırlarını `preventDefault()` + `focus()` ile çevir. Effect yalnızca `open` değişince kurulmalı; `onClose`’u dependency’den nasıl çıkarırsın?',
    '`const handleClose = useEffectEvent(() => onClose())`; Escape’te `handleClose()` çağır ve dependency array’i `[open]` yap.',
  ],
  preview: { entry: 'Preview.tsx' },
})
