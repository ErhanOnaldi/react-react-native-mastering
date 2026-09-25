import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Null posterin durumu',
  difficulty: 'kolay',
  concepts: ['ts.union', 'ts.literal'],
  files: ['posterState.ts'],
  hints: [
    'İki farklı eksiklik var: null ve boş metin.',
    'İkisini `||` ile bir koşulda birleştir.',
    'Koşul doğruysa `missing`, değilse `ready` döndür.',
  ],
})
