import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Tabs klavye düzenini tamamla',
  difficulty: 'zor',
  concepts: ['pattern.compound', 'a11y.keyboard', 'a11y.focus', 'react.useId'],
  files: ['KeyboardTabs.tsx'],
  hints: [
    'Kökte seçim state ve useId tabanı tut; Trigger id ve panel id değerini value üzerinden üret.',
    'List içindeki keydown olayında mevcut tabları DOM sırasıyla bul; Arrow/Home/End hedefine focus ve click uygula.',
    'Seçilmemiş panelleri hidden yap; tabIndex yalnızca seçili Trigger için 0 olsun.',
  ],
  preview: { entry: 'Preview.tsx' },
})
