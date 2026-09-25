import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film özeti sözleşmesi',
  difficulty: 'kolay',
  concepts: ['ts.object-types', 'ts.optional-nullable'],
  files: ['movieSummary.ts'],
  hints: [
    'Tagline opsiyoneldir; kullanmadan önce varlığına bak.',
    'Doluysa `title` ile araya ` — ` koyarak birleştir.',
    'Yoksa erken veya ternary dönüşle yalnızca `title` ver.',
  ],
})
