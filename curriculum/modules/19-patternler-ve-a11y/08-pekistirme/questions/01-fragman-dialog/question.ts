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
    'Önce arka planı `createPortal(..., document.body)` ile taşı ve dialoga rol/ad ver. Sonra dialogun içine tıkla: neden kapanıyor? Olay nereden nereye gidiyor?',
    'Arka planın `onClick`’i yalnızca tıklama arka planın **kendisine** olduysa kapatmalı. Focus için açan düğmeye bir ref, Oynat/Kapat’a iki ref tut; keydown’u açıkken dinle.',
    '`if (event.target === event.currentTarget) setOpen(false)`. Effect cleanup’ında dinleyiciyi kaldır ve `triggerRef.current?.focus()` çağır.',
  ],
  preview: { entry: 'Preview.tsx' },
})
