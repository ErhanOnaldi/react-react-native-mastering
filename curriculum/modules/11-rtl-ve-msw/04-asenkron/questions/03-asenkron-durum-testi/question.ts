import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Loading ve hata durumuna test yaz',
  difficulty: 'orta',
  concepts: ['test.async', 'test.msw-overrides', 'fetch.loading-states'],
  files: ['MovieStatus.test.tsx'],
  hints: [
    'Başlangıç durumunu getByRole ile hemen sına.',
    'Yavaş cevap için async handler içinde await delay(80) kullan.',
    'Hata testi için server.use(http.get(...)) ve findByRole("alert") kullan.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-loading', label: 'istek sırasında durum göstermeyen sürüm' },
      { id: 'swallow-error', label: 'HTTP hatasını sessizce yutan sürüm' },
    ],
  },
})
