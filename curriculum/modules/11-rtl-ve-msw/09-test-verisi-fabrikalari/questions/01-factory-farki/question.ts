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
      text: 'Her testte aynı id ve başlığı zorunlu kılar',
      explanation: 'Override id ve title alanlarını da değiştirebilir.',
    },
    {
      text: 'null alanını otomatik olarak undefined yapar',
      explanation: 'null TMDB sözleşmesinde anlamlıdır; factory bunu korumalıdır.',
    },
  ],
})
