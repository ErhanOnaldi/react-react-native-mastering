import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Router bağlamı',
  difficulty: 'kolay',
  concepts: ['test.custom-render', 'router.params'],
  question: 'useParams kullanan MovieDetailsPage tek başına render edilince neden sorun yaşar?',
  options: [
    {
      text: 'Router bağlamı verilmediği için hook route parametresini okuyamaz',
      correct: true,
      explanation: 'Testte createMemoryRouter ve RouterProvider ile adresi route’a bağlarsın.',
    },
    {
      text: 'RTL render otomatik olarak BrowserRouter kurar, ama başlangıç URL’i eksik kalır',
      explanation:
        'RTL render component’i DOM’a koyar; uygulama provider’larını ve router’ı kendiliğinden eklemez.',
    },
    {
      text: 'useParams yalnızca BrowserRouter altında çalışır; memory router bunu desteklemez',
      explanation:
        'Memory router test için geçerli bir Router bağlamı sağlar ve route parametrelerini aktarır.',
    },
  ],
})
