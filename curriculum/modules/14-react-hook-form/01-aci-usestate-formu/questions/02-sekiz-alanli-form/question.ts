import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sekiz alanlı formun maliyetini gör',
  difficulty: 'orta',
  concepts: ['react.controlled-input', 'react.state', 'react.render-cycle', 'perf.rerender'],
  files: ['ManualWatchlistForm.tsx'],
  hints: [
    'Önizlemede bir harf yazıp render sayacını izle; her alan ayrı state kullanıyor.',
    'Submit handler içinde boş ad, kısa ad ve boş ilk film için erken dön.',
    'Geçerli durumda sekiz state değerini tek draft nesnesinde `onSave` ile gönder.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
