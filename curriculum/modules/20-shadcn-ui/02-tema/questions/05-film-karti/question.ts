import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tema token’larıyla film kartı kur',
  difficulty: 'orta',
  concepts: ['shadcn.theming', 'tailwind.theme', 'tailwind.cn', 'react.props'],
  files: ['ThemeCard.tsx'],
  hints: [
    'Kartın hangi içeriği göstereceğini prompt’taki alanlardan kur; başlığı ve puanı ayrı HTML öğelerinde sun.',
    '`bg-card` ile `text-card-foreground` tema rollerini kullan. Köşe ve boşluk gibi yerel görünümleri de karta ekle.',
    'Dışarıdan gelen `className` ile varsayılan sınıfları `clsx` ve `tailwind-merge` üzerinden birleştir; dışarıdan gelen köşe sınıfını sona koy.',
  ],
})
