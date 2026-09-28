import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Başlıkları select ile oku',
  difficulty: 'orta',
  concepts: ['query.select', 'ts.inference', 'js.array-methods'],
  files: ['MovieTitles.tsx'],
  hints: [
    'Ekran yalnız başlık isterken cache’te hangi tam cevap kalmalı?',
    'Query observer’ında `select` ile `results` içinden isimleri çıkar.',
    '`select: page => page.results.map(movie => movie.title)`; success data’yı `<ol>` ile göster.',
  ],
})
