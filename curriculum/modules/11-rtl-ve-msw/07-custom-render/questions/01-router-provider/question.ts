import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Router bağlamı',
  difficulty: 'kolay',
  concepts: ['test.custom-render', 'router.params'],
  question: 'useParams kullanan MovieDetailsPage tek başına render edilince neden sorun yaşar?',
  options: [
    {
      text: 'Route eşleşmesi için RouterProvider ile bir router gerekir',
      correct: true,
      explanation: 'createMemoryRouter test URL’sini eşleşen route’a bağlar.',
    },
    {
      text: 'getByRole sadece BrowserRouter içinde çalışır',
      explanation: 'RTL sorguları DOM üzerinde çalışır; sorun useParams bağlamıdır.',
    },
    {
      text: 'MSW RouterProvider yerine geçer',
      explanation: 'MSW ağ cevaplarını yönetir; route bağlamı oluşturmaz.',
    },
  ],
})
