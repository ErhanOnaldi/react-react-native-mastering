import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Yenilemede hangi state kalır?',
  difficulty: 'kolay',
  concepts: ['auth.token-storage', 'redux.store'],
  question: 'Sinema access token’ı yalnız Redux store’da tutuyor. F5’ten sonra ne beklersin?',
  options: [
    {
      text: 'Store yeniden kurulacağı için token kaybolur.',
      correct: true,
      explanation: 'Bellekteki state yenilemeyle gider; kalıcılık ayrıca kurulmalıdır.',
    },
    {
      text: 'Redux otomatik localStorage’a yazar.',
      explanation: 'Redux tek başına kalıcılık sağlamaz; listener veya başka mekanizma gerekir.',
    },
    {
      text: 'JWT olduğu için tarayıcı token’ı otomatik saklar.',
      explanation: 'JWT bir veri biçimidir, tarayıcı storage politikası değildir.',
    },
  ],
})
