import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'RemoteData durum ekranı',
  difficulty: 'kolay',
  concepts: ['ts.discriminated-union', 'react.conditional-rendering', 'ts.narrowing'],
  files: ['RemoteView.tsx'],
  hints: [
    'Önce `status` üzerinden dört durumu ayır.',
    'Erken dönüşlerle idle, loading ve error dallarını bitir; success dalında `data` güvenle kullanılabilir.',
    'Error için `role="alert"`, boş success için “Film bulunamadı”, dolu success için id key’li liste döndür.',
  ],
})
