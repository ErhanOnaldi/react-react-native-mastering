import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema UI kit’ini kur',
  difficulty: 'zor',
  concepts: [
    'tailwind.cn',
    'tailwind.cva',
    'tailwind.theme',
    'tailwind.dark-mode',
    'react.props',
    'react.composition',
    'a11y.basics',
  ],
  project: 'sinema',
  focusFiles: [
    'src/lib/cn.ts',
    'src/components/ui/button.tsx',
    'src/components/ui/badge.tsx',
    'src/components/ui/card.tsx',
    'src/components/ui/skeleton.tsx',
    'src/components/ui/input.tsx',
    'src/index.css',
  ],
  reviewFiles: ['src/lib/cn.ts', 'src/components/ui/*.tsx', 'src/index.css'],
  rubric: [
    'Tailwind v4 @import, @theme ve @custom-variant dark kullanılır.',
    'Button doğal button props’larını, diğer bileşenler doğal öğe props’larını iletir.',
    'className override’ları cn ile çakışmaları çözer.',
    'Skeleton erişilebilirlik ağacından gizlenir; Input kullanım yerinden erişilebilir ad alabilir.',
  ],
  hints: [
    'Önce cn() fonksiyonunu kur; UI parçaları onu paylaşacak.',
    'Button için cva ve VariantProps kullan; varsayılan primary/md seç.',
    'Badge, Card, Skeleton ve Input için ComponentProps ile doğal props’ları aktar; className’i cn’nin son girdisi yap.',
  ],
})
