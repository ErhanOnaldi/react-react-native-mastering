import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tek öğede iki davranışı birleştir',
  difficulty: 'zor',
  concepts: ['pattern.slot', 'react.props', 'a11y.focus', 'js.optional-chaining'],
  files: ['SlotTrigger.tsx'],
  hints: [
    'asChild=false durumunda doğal button döndür.',
    'React.Children.only + cloneElement ile tek child’ı al; iki onClick handlerını sırayla çağır.',
    'Ref callback’inde hem child ref’e hem dış ref’e node ata; object ve function ref biçimlerini ele al.',
  ],
  preview: { entry: 'Preview.tsx' },
})
