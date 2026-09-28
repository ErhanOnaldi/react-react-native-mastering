import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'RemoteData durumunu göster',
  difficulty: 'orta',
  concepts: ['ts.discriminated-union', 'react.conditional-rendering'],
  files: ['Status.tsx'],
  hints: [
    'Görünen metin, `result` içindeki hangi durumun geldiğine bağlı.',
    '`result.status` discriminant alanı TypeScript’e hangi dalda hangi alanların okunabileceğini söyler.',
    'Idle/loading/error için ayrı return yaz; success dalında `result.data.length === 0` kontrolü yap.',
  ],
})
