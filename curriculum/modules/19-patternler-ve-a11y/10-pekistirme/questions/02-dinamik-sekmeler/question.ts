import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eksik fragmanda sekme akışı',
  difficulty: 'orta',
  concepts: [
    'a11y.keyboard',
    'a11y.focus',
    'react.derived-state',
    'react.conditional-rendering',
    'react.lists-keys',
  ],
  files: ['MovieSections.tsx'],
  hints: [
    'Sekmeleri bir diziden render et; diziyi `videos.length`’e göre kur. `aria-selected` ve `tabIndex` tek bir seçili değerden türesin.',
    'Yön tuşlarında o an görünen `[role="tab"]` düğmelerini DOM sırasıyla bul. Seçili sekme veriden düştüyse Özet’i göstermek için state’i değiştirmen gerekmez: render sırasında hesapla.',
    '`const active = sections.some((s) => s.key === selected) ? selected : "summary"`. Focus için: `active !== selected` olduğunda ve `document.activeElement === document.body` ise Özet sekmesine bir effect içinde `focus()` ver.',
  ],
  preview: { entry: 'Preview.tsx' },
})
