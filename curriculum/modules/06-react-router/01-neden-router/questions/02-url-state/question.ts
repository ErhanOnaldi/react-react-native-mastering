import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi değer URL’de yaşamalı?',
  difficulty: 'kolay',
  concepts: ['router.search-params', 'arch.state-categories'],
  question:
    'Kullanıcı aynı arama sonucunu arkadaşına göndermek istiyor. Hangi bilgi adresin parçası olmalı?',
  options: [
    {
      text: 'Arama metni ve sayfa numarası.',
      correct: true,
      explanation: 'Doğru. `?q=Matrix&page=2` aynı görünümü yeniden kurar.',
    },
    {
      text: 'Aramanın yazı alanında klavye odağının hangi karakterde olduğu.',
      explanation:
        'Klavye odağı kısa süreli etkileşim durumudur; linki açan kişiye aynı film sonuçlarını seçmez.',
    },
    {
      text: 'Listeyi ekrana basan `MovieCard` bileşeninin adı.',
      explanation:
        'Bileşen adı uygulamanın iç kodudur. Arama metni ve sayfa numarası ise hangi görünümün açılacağını anlatır.',
    },
  ],
})
