import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Eski detay isteğini iptal et',
  difficulty: 'orta',
  concepts: ['react.abort-controller', 'react.useEffect.cleanup', 'react.useEffect.deps'],
  files: ['AbortDetails.tsx'],
  hints: [
    'Controller effect içinde kurulmalı; her id’nin kendi controller’ı olur.',
    '`fetch` seçeneklerine `signal` ekle.',
    'Cleanup `controller.abort()` döndürsün; catch dalında `AbortError`’ı ayır.',
  ],
})
