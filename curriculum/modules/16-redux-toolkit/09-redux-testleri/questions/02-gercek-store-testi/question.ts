import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Bileşeni gerçek store ile bağla',
  difficulty: 'orta',
  concepts: ['redux.testing', 'test.rtl-queries', 'test.user-event'],
  files: ['WatchCounter.tsx'],
  hints: [
    'Bileşen içinde tipli selector ve dispatch hazır.',
    '`ids.length` oku; click’te `slice.actions.add(550)` dispatch et.',
    '`<output>{count} film</output>` ve `onClick` bağla.',
  ],
  preview: { entry: 'Preview.tsx' },
})
