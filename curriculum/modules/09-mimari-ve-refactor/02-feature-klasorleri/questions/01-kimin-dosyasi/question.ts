import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Dosyanın sahibi',
  difficulty: 'kolay',
  concepts: ['arch.feature-folders', 'arch.colocation'],
  question: 'Yalnız arama ekranının kullandığı `SearchBox.tsx` için ilk yer neresi olmalı?',
  options: [
    {
      text: 'features/search/components/',
      correct: true,
      explanation: 'Doğru. Tek tüketicisi arama feature’ı; yakınında tut.',
    },
    {
      text: 'shared/ui/',
      explanation:
        'shared/ gerçek ortak kullanımı anlatmalı; erken genelleme arama sorumluluğunu gizler.',
    },
    {
      text: 'features/movies/api/',
      explanation: 'Bu dosya UI bileşeni, film endpoint fonksiyonu değil.',
    },
    {
      text: 'Kök src/ dizini',
      explanation: 'Kök, sahipliği anlatmadığı için dosya sayısı artınca aramayı zorlaştırır.',
    },
  ],
})
