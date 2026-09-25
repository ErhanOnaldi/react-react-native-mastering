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
      text: 'Hover edilen kartın kenarlık rengi.',
      explanation: 'Geçici görsel durum paylaşılabilir ekranın parçası değildir.',
    },
    {
      text: 'Yalnızca React bileşeninin adı.',
      explanation: 'Bileşen adı kullanıcıya arama sonucunu yeniden açtırmaz.',
    },
  ],
})
