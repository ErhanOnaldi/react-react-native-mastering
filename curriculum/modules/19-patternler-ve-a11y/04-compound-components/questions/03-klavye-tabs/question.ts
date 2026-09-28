import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tabs klavye düzenini tamamla',
  difficulty: 'zor',
  concepts: ['pattern.compound', 'a11y.keyboard', 'a11y.focus', 'react.useId'],
  files: ['KeyboardTabs.tsx'],
  hints: [
    'Tab tuşunun gruba girişini ve ok tuşlarının grup içi dolaşımını ayrı düşün; DOM sırası değişince davranış da sırayı izlesin.',
    '`useId`, roving `tabIndex`, `aria-controls`, `aria-labelledby` ve List üzerindeki `keydown` davranışını kullan.',
    'Görünen tabları DOM sırasıyla bul; ArrowRight/Left döngüsü ile Home/End hedefini belirle, hedefi focus edip seç. Seçilmeyen panellere `hidden` ver.',
  ],
  preview: { entry: 'Preview.tsx' },
})
