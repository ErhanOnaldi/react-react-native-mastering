import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Açık ve koyu tema arasında geç',
  difficulty: 'orta',
  concepts: ['shadcn.theming', 'tailwind.theme', 'react.useState'],
  files: ['ThemeToggle.tsx'],
  hints: [
    'Tema tercihi değişince hem düğmenin erişilebilir durumu hem de `html` öğesindeki sınıf değişmeli.',
    '`useState` ile açık/koyu tercihini tut; düğmede `aria-pressed` ile seçili durumu bildir.',
    'Başlangıçta düğme `Koyu temaya geç` desin. Tıklama tema state’ini ve `document.documentElement.classList` içindeki `dark` sınıfını güncellesin.',
  ],
})
