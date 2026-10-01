import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Slice selector’ı',
  difficulty: 'orta',
  concepts: ['redux.selectors', 'ts.inference'],
  files: ['ui.ts'],
  hints: [
    'Bir slice kendi alanlarını ve bu alanlardan görünüm için gereken değerleri birlikte dışa açabilir.',
    '`createSlice` içinde tema değiştirici reducer’ı ve `selectors` alanını kur; başlangıç state’inde `dialogOpen` da bulunsun.',
    '`selectIsDark`, slice state’ini almalı ve yalnızca `state.theme === "dark"` sonucunu döndürmeli. Slice action ve selector’ını export et.',
  ],
})
