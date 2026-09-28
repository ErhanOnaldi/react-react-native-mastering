import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tek öğede iki davranışı birleştir',
  difficulty: 'zor',
  concepts: ['pattern.slot', 'react.props', 'a11y.focus', 'js.optional-chaining'],
  files: ['SlotTrigger.tsx'],
  hints: [
    'İki kullanımda da DOM’da tek etkileşimli öğe kalmalı. Click, ad ve focus bağlantılarının hangi kaynaktan geldiğini sırala.',
    "`Children.only`, `cloneElement`, React 19 `ref` prop'unu ve `defaultPrevented` event alanını kullan.",
    "Child handler'ını önce çağır; iptal etmediyse açma eylemini çalıştır. Class'ları birleştir, child adı varsa koru ve iki ref'i aynı node'a bağla.",
  ],
  preview: { entry: 'Preview.tsx' },
})
