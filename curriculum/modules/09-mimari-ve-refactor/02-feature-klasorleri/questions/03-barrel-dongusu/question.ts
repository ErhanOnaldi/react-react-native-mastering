import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Barrel sınırı nereye konur?',
  difficulty: 'orta',
  concepts: ['arch.barrel-files', 'arch.feature-folders'],
  question:
    '`features/movies/index.ts` dışarıya `MovieCard` ve `useMovies` export ediyor. `MovieCard.tsx` kendi feature’ındaki yardımcıyı `import { formatTitle } from "./index"` ile alıyor. En sağlıklı değişiklik hangisi?',
  options: [
    {
      text: 'Feature içindeki dosya `formatTitle`ı doğrudan `./formatTitle`dan alır; `index.ts` dışarıya açık API için kalır.',
      correct: true,
      explanation:
        'Doğru. İçeriden barrel’a geri dönmek karşılıklı import zinciri oluşturabilir; dış tüketiciler için tek giriş noktası yine yararlıdır.',
    },
    {
      text: 'Bütün iç importları barrel üzerinden geçirmek döngü riskini tamamen kaldırır.',
      correct: false,
      explanation:
        'Barrel kendi export ettiği dosyalara bağlıdır; içeride aynı barrel’a geri dönmek döngü kurabilir.',
    },
    {
      text: 'Her dosya için ayrı barrel açmak tree shaking sorunlarını otomatik çözer.',
      correct: false,
      explanation:
        'Ek barrel dosyaları bağımlılık yönünü açıklamaz; export biçimi ve yan etkiler ayrıca değerlendirilir.',
    },
  ],
})
