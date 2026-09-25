import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'RemoteData durumunu göster',
  difficulty: 'orta',
  concepts: ['ts.discriminated-union', 'react.conditional-rendering'],
  files: ['Status.tsx'],
  hints: [
    '`result.status` ile her durumu ayır.',
    'Başarı dalında `data.length` kullan.',
    'Idle, loading ve error için erken dönüş; kalan dal success olur.',
  ],
})
