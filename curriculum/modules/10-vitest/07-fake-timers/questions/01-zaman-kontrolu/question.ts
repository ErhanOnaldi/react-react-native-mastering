import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '500 ms sınırı',
  difficulty: 'kolay',
  concepts: ['test.fake-timers'],
  question: `Bir callback 500 ms sonra çalışmalı. Bu koddan sonra callback’in 499 ms’de çalışmadığını ve 500 ms’de çalıştığını nasıl hızlıca denetlersin?

\`\`\`ts
setTimeout(onDismiss, 500)
\`\`\``,
  options: [
    {
      text: '`vi.useFakeTimers()` açıp `vi.advanceTimersByTime` ile önce 499, sonra 1 ms ilerletirim',
      correct: true,
      explanation: 'Sanal saat gerçek bekleme olmadan iki sınır anını ayrı ayrı gözlemletir.',
    },
    {
      text: '`vi.advanceTimersByTime(500)` çağırıp yalnız son durumu kontrol etmek',
      correct: false,
      explanation:
        'Yalnızca son anı görmek callback’in 500 ms’den önce çalışıp çalışmadığını göstermez.',
    },
    {
      text: 'Saat ilerletmeden callback’in çağrılmadığını doğrulamak',
      correct: false,
      explanation:
        'Bu yalnızca başlangıç durumunu ölçer; 500 ms sonunda callback’in çalıştığını kanıtlamaz.',
    },
  ],
})
