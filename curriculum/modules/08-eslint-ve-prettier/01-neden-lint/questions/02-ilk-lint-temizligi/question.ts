import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İlk lint temizliği',
  difficulty: 'kolay',
  concepts: ['tooling.eslint', 'js.modules'],
  files: ['movieSource.ts'],
  hints: [
    'Lint mesajının işaret ettiği import’u bul.',
    '`MovieCard` bu bileşende kullanılmıyor; import satırını kaldır.',
  ],
})
