import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Zamanlayıcı callback’ini test et',
  difficulty: 'orta',
  concepts: ['test.fake-timers', 'test.matchers'],
  files: ['schedule.test.ts'],
  hints: [
    'Önce callback’in henüz çalışmaması gereken anı belirle.',
    '`vi.useFakeTimers()` ile gerçek saati beklemeden callback durumunu gözle.',
    '499 ms ilerletip çağrılmadığını, ardından 1 ms ilerletip çağrıldığını doğrula.',
    'Her testten sonra `vi.useRealTimers()` ile gerçek saate dön.',
  ],
  testWriting: {
    mutants: [
      { id: 'instant', label: 'callback’i hemen çalıştıran sürüm' },
      { id: 'early', label: 'callback’i beklenen süreden erken çalıştıran sürüm' },
    ],
  },
})
