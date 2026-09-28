import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Preview ve source map',
  difficulty: 'orta',
  concepts: ['deploy.build-preview'],
  question:
    'Ekip, son build’i yerelde açıp hata servisine source map yüklemek istiyor. Hangi ikili doğru?',
  options: [
    {
      text: '`vite preview` ve `build.sourcemap: "hidden"`',
      correct: true,
      explanation:
        'Preview `dist/` çıktısını sunar; hidden map dosyası üretir ama bundle’a map bağlantısı koymaz.',
    },
    {
      text: '`vite dev` ve `build.sourcemap: false`',
      correct: false,
      explanation: 'Dev sunucusu üretim çıktısını sunmaz; false ise yüklemek için map üretmez.',
    },
    {
      text: '`vite preview` ve `build.sourcemap: false`',
      correct: false,
      explanation: 'Preview doğru sunucudur, ancak false seçimi source map üretimini kapatır.',
    },
  ],
})
