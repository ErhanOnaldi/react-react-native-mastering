import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama state’ini daralt',
  difficulty: 'orta',
  concepts: ['perf.rerender', 'react.state', 'react.controlled-input'],
  files: ['SearchShell.tsx'],
  hints: [
    'State değişimini hangi alt ağaç gerçekten kullanıyor?',
    'Sabit sonuçları ayrı bileşene ayır ve aynı props ile yeniden çağrılmasını önle.',
    '`memo(function Results({ onRender }) { ... })` kullan; callback yalnız bu bileşende çağrılsın.',
  ],
})
