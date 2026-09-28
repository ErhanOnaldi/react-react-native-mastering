import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Build çıktısında ne kalır?',
  difficulty: 'kolay',
  concepts: ['deploy.build-preview', 'tooling.build'],
  question:
    '`vite build` sonrasında `dist/` klasöründe `index.html` ve `assets/app-a41c.js` var. Bir sonraki build farklı JS üretiyor. Hangi yorum doğru?',
  options: [
    {
      text: 'JS içeriği değişirse hash’li dosya adı değişebilir; HTML yeni dosyaya işaret eder.',
      correct: true,
      explanation: 'İçerik hash’i dosya adına girer. Yeni HTML, yeni asset URL’sini taşır.',
    },
    {
      text: 'Hash yalnızca insanın okuyabilmesi içindir; dosya adı hep aynı kalır.',
      correct: false,
      explanation:
        'Hash dosya adının parçasıdır ve içerik değişiminde cache anahtarını değiştirir.',
    },
    {
      text: 'Tarayıcı doğrudan `src/` içindeki TSX dosyalarını indirir.',
      correct: false,
      explanation:
        'Üretimde tarayıcı build edilen JS ve CSS dosyalarını indirir; TSX kaynağı doğrudan sunulmaz.',
    },
  ],
})
