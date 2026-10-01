import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Factory neden kullanılır?',
  difficulty: 'kolay',
  concepts: ['test.factories', 'ts.partial'],
  question: 'poster_path null durumunu sınarken makeMovie({ poster_path: null }) neden yararlı?',
  options: [
    {
      text: 'Yalnızca testin önemli farkını görünür kılar ve kalan alanları geçerli doldurur',
      correct: true,
      explanation:
        'Partial override gerçek TMDB nesnesinin diğer zorunlu alanlarını tek yerde sağlar.',
    },
    {
      text: '16 alanlı fixture nesnesini her testte tekrar yazmak zorunda bırakır',
      explanation:
        'Factory tek yerde geçerli varsayılanları kurar; çağrı yalnız `poster_path` farkını belirtir.',
    },
    {
      text: 'Verilen `null` değerini varsayılan poster yolu ile değiştirir',
      explanation:
        'Override’daki `null` anlamlı bir sınır durumudur ve factory sonucu aynen korumalıdır.',
    },
  ],
})
