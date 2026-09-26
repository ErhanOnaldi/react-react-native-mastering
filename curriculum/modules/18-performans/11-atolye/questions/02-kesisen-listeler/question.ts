import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kesişen listeler',
  difficulty: 'zor',
  concepts: ['query.keys', 'query.invalidation', 'router.search-params'],
  files: ['GenreBoard.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'İki tür arasında hızlı geçiş yapınca hangi cevap hangi türe ait, bunu neye bakarak ayırt edersin?',
    'Her tür için ayrı bir sorgu kimliği kullanırsan, geç gelen bir cevap artık ekranda olmayan türün sonucunu ezmez.',
    '`useQuery`’de `queryKey`’e seçili türü de ekle; bir film puanlandıktan sonra “Puanladıklarım” sorgusunu `invalidateQueries` ile tazele.',
  ],
})
