import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Erken dönüşte ne değişir?',
  difficulty: 'orta',
  concepts: ['perf.compiler'],
  question: `Bir bileşen veri gelene kadar \`if (!movie) return null\` ile erken dönüyor. React Compiler'ın davranışı elle yazılan Hook'lardan nasıl ayrılır?`,
  options: [
    {
      text: 'Derleyici erken dönüşün ardından gelen güvenli hesapları da inceleyebilir; bileşen doğru sonuç üretmeye devam eder.',
      correct: true,
      explanation:
        'Compiler derleme sırasında kodu analiz eder; Hook çağrı sırası kuralına bağlı elle yazılan memo hook’ları gibi davranmaz.',
    },
    {
      text: 'Compiler erken dönüşü kaldırıp ekranda olmayan filmi gösterir.',
      correct: false,
      explanation:
        'Derleyici render mantığını değiştirmez; veri yokken bileşen null döndürmeye devam eder.',
    },
    {
      text: 'Compiler bu bileşeni her zaman optimize etmeyi reddeder.',
      correct: false,
      explanation:
        'Erken dönüş tek başına derleyicinin optimizasyonu atlaması için bir neden değildir.',
    },
  ],
})
