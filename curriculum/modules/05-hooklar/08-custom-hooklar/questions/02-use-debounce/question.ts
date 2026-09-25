import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Yazmayı bekleyen hook',
  difficulty: 'orta',
  concepts: ['react.custom-hooks', 'react.useEffect.cleanup', 'react.useEffect.deps'],
  files: ['useDebounce.ts'],
  hints: [
    'Gecikmiş değer için state kullan.',
    'Effect’te `setTimeout` kur ve `[value, delay]` ile yeniden başlat.',
    'Cleanup eski timeout’u `clearTimeout` ile temizler.',
  ],
})
