import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Trace ne gösteriyor?',
  difficulty: 'orta',
  concepts: ['test.playwright-debug', 'test.playwright-network'],
  question:
    'CI trace’inde TMDB isteği 401 dönüyor ve sayfa `role=alert` gösteriyor. İlk düzeltme nerede aranmalı?',
  options: [
    {
      text: 'İsteğin Authorization başlığında ve route taklidinin 401 koşulunda',
      correct: true,
      explanation: '401 ağ katmanının kanıtıdır; header ve taklit yanıtını incele.',
    },
    {
      text: 'Locator’a `waitForTimeout(5000)` ekleyerek',
      correct: false,
      explanation: 'Beklemek 401 yanıtını değiştirmez; yalnızca hatayı geç gösterir.',
    },
    {
      text: 'Heading’in CSS sınıfını güncelleyerek',
      correct: false,
      explanation: 'CSS sınıfı sunucunun 401 yanıtıyla ilgili değildir.',
    },
  ],
  explanation: '',
})
