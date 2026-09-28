import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kart slot’ları',
  difficulty: 'kolay',
  concepts: ['react.composition', 'react.children'],
  files: ['MoviePanel.tsx'],
  hints: [
    'Ana içerik ile alt eylem nerede görünmeli; alt eylem verilmediğinde ne olmalı?',
    '`children` ve `actions` için render edilebilir içerik tipi kullan; yalnız nullish değeri yok say.',
    '`article` içine `children`, `actions != null` iken `<footer>{actions}</footer>` koy.',
    'Sıfır geçerli içeriktir; `actions && ...` ile footer koşulu kurma.',
  ],
})
