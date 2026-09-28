import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kart callback kimliği',
  difficulty: 'orta',
  concepts: ['perf.memo', 'react.useCallback', 'react.props'],
  files: ['FavoriteCards.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Sayaç state’i değiştiğinde ebeveyn bileşen render olur; alt kartların gereksiz çalışmasını önlemek için iki parçalı bir referans koruması gerekir.',
    'Kartları `memo` ile sarılmış ayrı bir alt bileşene çıkar (`Card`), prop olarak iletilen fonksiyon referansını ise `useCallback` ile sabitle.',
    '`const onFavorite = useCallback((title: string) => setFavorite(title), [])` ve `const Card = memo(...)` birlikte kullanılır.',
    '`Card` bileşenine inline ok fonksiyonu (`onClick={() => onFavorite(title)}`) geçirirsen her render’da yeni bir fonksiyon nesnesi oluşur ve `memo`’nun props karşılaştırmasını bozar; fonksiyon referansını kararlı tut.',
  ],
})
