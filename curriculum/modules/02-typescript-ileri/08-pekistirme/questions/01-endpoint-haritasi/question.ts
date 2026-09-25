import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Endpoint yolunu cevaba bağla',
  difficulty: 'zor',
  concepts: ['ts.generics', 'ts.keyof-typeof', 'ts.api-types', 'ts.indexed-access'],
  files: ['task.ts'],
  hints: [
    'Map anahtarları literal URL path olsun.',
    'İki liste için Paginated<Movie>, detay için MovieDetails kullan.',
    'İndeksli erişim `responses[path]` doğru dönüş tipini korur.',
  ],
})
