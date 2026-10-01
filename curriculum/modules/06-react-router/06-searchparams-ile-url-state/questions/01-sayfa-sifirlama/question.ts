import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yeni aramada sayfa hatası',
  difficulty: 'orta',
  concepts: ['router.search-params', 'react.derived-state'],
  question:
    '`?q=Matrix&page=4&genre=28` açık. Kullanıcı `q` değerini `Dövüş` yapıyor. Doğru yeni URL hangisi?',
  options: [
    {
      text: '`?q=Dövüş&genre=28` (sayfa varsayılan 1).',
      correct: true,
      explanation: 'Doğru. Yeni arama eski sayfanın dördüncü sayfasından başlamamalı; tür korunur.',
    },
    {
      text: '`?q=Dövüş&page=4&genre=28`.',
      explanation: 'Eski sayfa yeni sorguda boş sonuç yanılsaması yaratır.',
    },
    {
      text: '`?q=Dövüş`.',
      explanation: 'Sayfa sıfırlanır ama kullanıcının tür filtresi gereksiz yere kaybolur.',
    },
  ],
})
