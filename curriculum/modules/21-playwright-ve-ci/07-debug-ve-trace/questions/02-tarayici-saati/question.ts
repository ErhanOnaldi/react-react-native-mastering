import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi saat değişir?',
  difficulty: 'orta',
  concepts: ['test.playwright-debug', 'test.fake-timers'],
  question:
    'Sinema oturumu tarayıcıda `Date.now()` ile sona eriyor. Vitest test sürecinde `vi.useFakeTimers()` açınca E2E sayfası neden etkilenmez?',
  options: [
    {
      text: 'Tarayıcı ayrı süreçtir; `page.clock.install()` gezinmeden önce kurulmalı',
      correct: true,
      explanation:
        'Doğru. Node fake timer’ı yalnızca Vitest sürecini etkiler; sayfa saatini Playwright clock denetler.',
    },
    {
      text: 'Playwright zaten her testte zamanı otomatik dondurur',
      correct: false,
      explanation: 'Playwright saati varsayılan olarak gerçek akar; clock açıkça kurulur.',
    },
    {
      text: '`storageState` saati de dosyaya kaydeder',
      correct: false,
      explanation: 'storageState cookie ve localStorage gibi durumları taşır, zamanı değil.',
    },
  ],
  explanation: '',
})
