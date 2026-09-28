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
    'Bu akış önceki modal, portal ve klavye kurallarını birleştiriyor. İçeri tıklama ile arka plana tıklama aynı sonuç vermemeli.',
    '`createPortal`, `event.target/currentTarget`, `useEffect` cleanup ve DOM focus yönetimini gözden geçir.',
    'Arka planı yalnız hedef ile handler sahibi aynıysa kapat. Kapanışta dinleyiciyi temizle ve açan düğmeye focus ver.',
  ],
  preview: { entry: 'Preview.tsx' },
})
