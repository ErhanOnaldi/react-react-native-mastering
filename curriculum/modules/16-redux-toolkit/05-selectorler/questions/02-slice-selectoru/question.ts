import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Slice selector’ı',
  difficulty: 'orta',
  concepts: ['redux.selectors', 'ts.inference'],
  files: ['ui.ts'],
  hints: [
    'Sonuç yalnızca tema değerine bağlı olmalı; diğer UI alanları ilgisizdir.',
    'Slice içindeki `selectors` alanında selector, root state değil slice state alır.',
    '`state.theme === "dark"` karşılaştırmasını `selectIsDark` selector’ından döndür.',
  ],
})
