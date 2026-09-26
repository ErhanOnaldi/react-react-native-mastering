import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Profiler metriğinin adını türet',
  difficulty: 'orta',
  concepts: ['ts.keyof-typeof', 'perf.rerender'],
  question:
    'Profiler ölçümleri `const metrics = { renderCount: 0, durationMs: 0 }` nesnesinde tutuluyor. Yeni metrik eklendiğinde de güncellenecek `MetricName` union’ı hangisi?',
  options: [
    {
      text: '`type MetricName = keyof typeof metrics`',
      correct: true,
      explanation:
        'Doğru. `typeof` nesnenin tipini, `keyof` o tipin anahtarlarını alır; iki adım birlikte yeni metriği kapsar.',
    },
    {
      text: '`type MetricName = typeof metrics`',
      correct: false,
      explanation: 'Bu tüm nesnenin tipidir; yalnız anahtar adlarını vermez.',
    },
    {
      text: '`type MetricName = keyof "metrics"`',
      correct: false,
      explanation:
        'String literal’ın anahtarları metrik adları değildir; nesnenin tipinden başlamalısın.',
    },
  ],
})
