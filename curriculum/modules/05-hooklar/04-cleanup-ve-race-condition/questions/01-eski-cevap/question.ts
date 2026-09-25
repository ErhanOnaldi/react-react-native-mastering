import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Hangi cevap ekrana yazılır?',
  difficulty: 'kolay',
  concepts: ['react.race-conditions', 'react.useEffect.cleanup'],
  question: 'İlk arama yavaş, ikinci arama hızlı dönüyor. Cleanup yoksa ne olabilir?',
  options: [
    {
      text: 'İlk aramanın geç cevabı ikinci sonucu ezebilir.',
      correct: true,
      explanation: 'Promise’lerin bitiş sırası başlama sırası olmak zorunda değildir.',
    },
    {
      text: 'React otomatik olarak yalnızca son cevabı kabul eder.',
      explanation: 'React ağ cevabının güncelliğini kendiliğinden bilemez.',
    },
    {
      text: 'Dependency array bu yarışmayı tek başına çözer.',
      explanation: 'Yeni istek başlatır ama eski cevabı iptal etmez.',
    },
  ],
})
