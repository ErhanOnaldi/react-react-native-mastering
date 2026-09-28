import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Modalı body altına taşı',
  difficulty: 'kolay',
  concepts: ['pattern.portal', 'a11y.basics', 'react.children'],
  files: ['BodyPortal.tsx'],
  hints: [
    'Kartın DOM sınırının dışına taşınması gerekiyor; React ebeveyn ilişkisi ve tıklama davranışı korunmalı.',
    '`react-dom` içindeki `createPortal` API’sini araştır; hedef container olarak `document.body` kullan.',
    'Çocukları erişilebilir adı `Fragman alanı` olan bir region içine al ve o region’ı portala ver.',
  ],
  preview: { entry: 'Preview.tsx' },
})
