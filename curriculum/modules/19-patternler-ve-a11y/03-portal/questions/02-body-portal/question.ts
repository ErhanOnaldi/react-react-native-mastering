import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Modalı body altına taşı',
  difficulty: 'kolay',
  concepts: ['pattern.portal', 'a11y.basics', 'react.children'],
  files: ['BodyPortal.tsx'],
  hints: [
    'React DOM içinden createPortal import et.',
    'createPortal ilk argümanda JSX, ikinci argümanda document.body alır.',
  ],
  preview: { entry: 'Preview.tsx' },
})
