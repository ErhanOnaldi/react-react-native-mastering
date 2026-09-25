import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Dosyanın yerini seç',
  difficulty: 'kolay',
  concepts: ['arch.feature-folders', 'arch.colocation', 'js.array-methods'],
  files: ['chooseFolder.ts'],
  hints: [
    'Önce kullanan feature sayısına bak.',
    'Tek bir benzersiz kullanıcı varsa dosya ona aittir.',
    'Set ile tekrar eden adları ayıkla; tekse `features/<ad>`, birden fazlaysa `shared` döndür.',
  ],
})
