import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İlk lint temizliği',
  difficulty: 'kolay',
  concepts: ['tooling.eslint', 'js.modules'],
  files: ['movieSource.ts'],
  hints: [
    'Kaynak metnindeki import adlarını bileşenin kullandığı adlarla karşılaştır.',
    'Kuralın gerektirdiği şey artık kullanılmayan import’u silmek; ESLint unused-variable uyarısını verir.',
    "Yalnızca `import { MovieCard } from './MovieCard'` satırını metinden çıkar; bileşen export’unu bırak.",
  ],
})
