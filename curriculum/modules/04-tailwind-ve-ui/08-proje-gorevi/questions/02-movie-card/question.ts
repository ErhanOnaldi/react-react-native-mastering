import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'MovieCard’ı UI kit ile yenile',
  difficulty: 'zor',
  concepts: [
    'tailwind.cva',
    'tailwind.cn',
    'react.props',
    'react.events',
    'react.composition',
    'react.controlled-input',
    'react.lifting-state',
    'a11y.basics',
  ],
  project: 'sinema',
  focusFiles: [
    'src/components/MovieCard.tsx',
    'src/components/SearchBox.tsx',
    'src/components/MovieGrid.tsx',
  ],
  reviewFiles: [
    'src/components/MovieCard.tsx',
    'src/components/SearchBox.tsx',
    'src/components/MovieGrid.tsx',
  ],
  rubric: [
    'MovieCard, kitteki Card, Badge ve Button bileşenlerini kullanır.',
    'Favori düğmesinin erişilebilir adı ve aria-pressed durumu favori state’iyle eşleşir.',
    'SearchBox doğal Input bileşenini ve erişilebilir adını kullanır.',
    'Statik arama ve favori akışı korunur.',
  ],
  hints: [
    'MovieCard içindeki eski buton class dizisini Button variant’ına taşı.',
    'Puanı Badge, kart çerçevesini Card ile oluştur; favori düğmesinde aria-pressed değerini isFavorite’dan al.',
    'SearchBox’taki input’u kitteki Input ile değiştirirken value ve onChange’i koru.',
  ],
})
