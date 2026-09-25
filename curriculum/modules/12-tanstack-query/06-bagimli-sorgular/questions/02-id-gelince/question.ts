import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Id gelince başlat',
  difficulty: 'orta',
  concepts: ['query.dependent', 'ts.narrowing', 'react.custom-hooks'],
  files: ['useOptionalMovie.ts'],
  hints: [
    'Hook her render’da çağrılmalı; koşulu `queryFn` içine taşı.',
    '`id === undefined ? skipToken : async () => ...` kullan.',
    'İstek dalında Bearer başlığı, `response.ok` kontrolü ve JSON dönüşü ekle.',
  ],
})
