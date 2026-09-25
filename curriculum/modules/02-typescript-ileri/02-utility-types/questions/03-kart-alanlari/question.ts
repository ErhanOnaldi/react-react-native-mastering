import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kartın küçük tipini türet',
  difficulty: 'orta',
  concepts: ['ts.pick', 'ts.object-types', 'ts.optional-nullable'],
  files: ['task.ts'],
  hints: [
    'Ayrı bir kart nesnesi tipi kopyalama; Pick kullan.',
    '`poster_path === null` dalını ayır.',
    'Poster yoksa `movie.title + " (poster yok)"` döndür.',
  ],
})
