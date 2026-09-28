import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sekiz alanlı formun maliyetini gör',
  difficulty: 'orta',
  concepts: ['react.controlled-input', 'react.state', 'react.render-cycle', 'perf.rerender'],
  files: ['ManualWatchlistForm.tsx'],
  hints: [
    'Önce bir karakter yazıp sayaçtaki önce/sonra değerlerini karşılaştır; her alanın değerini ve değişim yolunu eşleştir.',
    'Controlled input için `useState` kullan; submit sırasında `preventDefault()` ile formun tarayıcı navigasyonunu durdur.',
    'Üç koşulu ayrı ayrı doğrula, hata varsa `onSave` çağırma; aksi halde sekiz state değerini `WatchlistDraft` nesnesinde birleştir.',
    'Sayı artışının tam miktarını sabitleme; geliştirme StrictMode ek render gösterebilir.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
