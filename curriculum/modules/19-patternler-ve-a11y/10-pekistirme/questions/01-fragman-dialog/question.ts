import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Fragman akışını birleştir',
  difficulty: 'zor',
  concepts: [
    'pattern.portal',
    'a11y.keyboard',
    'a11y.focus',
    'react.events',
    'react.useEffect.cleanup',
    'react.useId',
  ],
  files: ['TrailerDialog.tsx'],
  hints: [
    'Dialogun içindeki tıklama neden arka planı kapatıyor? Olayın nereden nereye gittiğini ve focus dönüşünü düşün.',
    'Arka planı `createPortal(..., document.body)` ile taşı. `onClick` yalnız arka planın kendisine tıklanınca kapatsın; focus için düğme ref’lerini kullan.',
    '`if (event.target === event.currentTarget) setOpen(false)`. Effect cleanup’ında dinleyiciyi kaldır ve `triggerRef.current?.focus()` çağır.',
  ],
  preview: { entry: 'Preview.tsx' },
})
