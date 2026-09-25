import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'VITE_ değişkenleri hakkında',
  difficulty: 'orta',
  concepts: ['tooling.env'],
  mode: 'multiple',
  question: 'Vite projelerindeki ortam değişkenleri hakkında **hangileri doğru**?',
  options: [
    {
      text: '`VITE_` ile başlayan değerler build’de JavaScript dosyasına gömülür ve kullanıcılar görebilir',
      correct: true,
      explanation: 'Doğru. .env değeri GitHub’dan saklar, tarayıcıdan saklamaz.',
    },
    {
      text: '`.env.example` commit’lenir, `.env` commit’lenmez',
      correct: true,
      explanation: 'Doğru. Example gerekli değişkenleri belgeler; gerçek değerler yerelde kalır.',
    },
    {
      text: '`VITE_PAGE_SIZE=20` kodda `20` sayısı olarak gelir',
      explanation:
        'Hayır: tüm env değerleri string’dir (`"20"`). `Number(...)` ile çevirmen gerekir.',
    },
    {
      text: '`SECRET_KEY` (öneksiz) değişkeni de `import.meta.env` ile tarayıcıda okunabilir',
      explanation:
        'Hayır: Vite yalnızca `VITE_` önekli değişkenleri istemciye verir. Bu bir güvenlik önlemidir.',
    },
    {
      text: '`.env` değişince dev sunucusu değişikliği anında alır',
      explanation:
        'Hayır: env değerleri sunucu başlarken okunur; değiştirince `pnpm dev`’i yeniden başlat.',
    },
  ],
})
