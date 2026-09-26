import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL değerlerini güvenli oku',
  difficulty: 'kolay',
  concepts: ['router.search-params', 'ts.narrowing', 'js.optional-chaining'],
  files: ['readSearch.ts'],
  hints: [
    'Her anahtarı `params.get` ile oku.',
    'Sayısal alanlarda pozitif `Number.isSafeInteger` denetimi yap; genre yokluğunu ayrıca kontrol et.',
  ],
})
