import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Link gibi davranan Sinema eylemi',
  difficulty: 'orta',
  concepts: ['pattern.slot', 'tailwind.cva', 'tailwind.cn', 'shadcn.components', 'react.props'],
  files: ['MovieAction.tsx'],
  hints: [
    '`asChild` için ek bir button üretmeden tek çocuğun elementini kullan.',
    '`Slot.Root` ile `button` arasında bileşen seç; variant sınıflarını `cva` ile üret.',
    '`const Comp = asChild ? Slot.Root : "button"` sonrası `cn(styles({ variant }), className)` değerini geçir.',
  ],
})
