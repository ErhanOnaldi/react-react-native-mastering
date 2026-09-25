import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Liste cevabını test et',
  difficulty: 'orta',
  concepts: ['test.matchers', 'ts.object-types', 'fetch.query-params'],
  files: ['summarizeMovies.test.ts'],
  hints: [
    'Liste sonucunun yalnızca ilgili alanlarını karşılaştır.',
    '`toMatchObject` ile `page` ve `total_pages` alanlarını birlikte denetle.',
    'İkinci sayfa için `page: 2`, 41 sonuç için `total_pages: 3` bekle.',
  ],
  testWriting: {
    mutants: [
      { id: 'first-page', label: 'istenen sayfayı ilk sayfa gibi bildiren sürüm' },
      { id: 'floor-pages', label: 'kısmi son sayfayı saymayan sürüm' },
    ],
  },
})
