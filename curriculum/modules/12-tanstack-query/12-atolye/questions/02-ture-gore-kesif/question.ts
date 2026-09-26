import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Türe göre keşif',
  difficulty: 'zor',
  concepts: ['query.keys', 'query.pagination', 'router.search-params'],
  files: ['GenreDiscover.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Tür ve sayfa birlikte sonucun kimliğini belirler.',
    'Seçimleri URL’de tut; veri sorgusunun key değerine ikisini de kat.',
    'Tür değişince page 1 olsun; geri gezinince eski tür ve sayfanın kendi sonucu görünsün.',
  ],
})
