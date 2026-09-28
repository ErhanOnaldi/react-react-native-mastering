import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Eski detay isteğini iptal et',
  difficulty: 'orta',
  concepts: ['react.abort-controller', 'react.useEffect.cleanup', 'react.useEffect.deps'],
  files: ['AbortDetails.tsx'],
  hints: [
    'Yeni id geldiğinde eski ağ işi artık bu ekran için geçerli değil.',
    '`AbortController` effect içinde kurulmalı; her id’nin kendi controller’ı olur.',
    '`fetch` seçeneklerine `signal` ekle ve cleanup’ta `controller.abort()` çağır.',
    'Catch dalında `AbortError` adını normal hata gibi ekrana yazma.',
  ],
})
