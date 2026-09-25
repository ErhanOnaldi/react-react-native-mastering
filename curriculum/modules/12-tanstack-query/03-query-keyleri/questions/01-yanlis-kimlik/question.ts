import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yanlış cache kimliği',
  difficulty: 'kolay',
  concepts: ['query.keys', 'router.search-params', 'react.useEffect.deps'],
  question:
    '`queryFn` `q` değerini kullanıyor ama key hep `["movies", "search"]`. `?q=Matrix`ten `?q=Dövüş`e geçince ne düzeltilmeli?',
  options: [
    {
      text: '`q` key’e eklenmeli',
      correct: true,
      explanation: 'Farklı arama sonucu farklı cache girdisidir.',
    },
    {
      text: 'Yalnız `queryFn` closure’ını değiştir',
      explanation: 'Cache kimliği değişmezse Query aynı sorguyu izler.',
    },
    {
      text: '`q` değerini URL’den kaldır',
      explanation: 'URL state paylaşılabilir arama için gerekir; sorun key eksikliğidir.',
    },
  ],
})
