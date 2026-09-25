import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Boş tarihten yılı çıkar',
  difficulty: 'kolay',
  concepts: ['ts.narrowing', 'js.dates'],
  files: ['yearLabel.ts'],
  hints: [
    'Boş string ayrı bir durumdur.',
    'Önce `date === ""` için erken dön.',
    'Dolu tarihte `.slice(0, 4)` yeterlidir.',
  ],
})
