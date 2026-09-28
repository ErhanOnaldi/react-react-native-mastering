import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Global mutation hatasını bildir',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'fetch.error-handling'],
  files: ['makeClient.ts'],
  hints: [
    'Bileşenler route değiştirince de erişilecek bildirim callback’inin sahibi kim olmalı?',
    '`MutationCache` global `onError` seçeneğini ve QueryClient `defaultOptions` değerlerini kullan.',
    '`new QueryClient({ mutationCache: new MutationCache({ onError: () => notify(...) }), defaultOptions: ... })` kur.',
    'Global callback yalnız bir kez tetiklenmeli; retry değerlerini query ve mutation için kapat.',
  ],
})
