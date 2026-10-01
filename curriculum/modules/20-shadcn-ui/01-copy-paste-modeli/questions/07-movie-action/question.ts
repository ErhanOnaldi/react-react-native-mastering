import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Link gibi davranan Sinema eylemi',
  difficulty: 'orta',
  concepts: ['pattern.slot', 'tailwind.cva', 'tailwind.cn', 'shadcn.components', 'react.props'],
  files: ['MovieAction.tsx'],
  hints: [
    'Önce DOM sonucunu düşün: link kullanımında hangi element rolü ve kaç element kalmalı?',
    'Çocuğa props aktaran `Slot.Root`, `cva` ve `cn` araçlarını birlikte kullanabilirsin.',
    '`const Element = asChild ? Slot.Root : "button"` seç; class listesini `cn(styles({ variant }), className)` ile kur ve kalan button props\'larını `Element`\'e geçir.',
    'Tek çocuk şartını koru; Slot birden çok kardeş öğeyi tek linke dönüştürmez.',
  ],
})
