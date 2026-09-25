import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangileri derlenmez?',
  difficulty: 'orta',
  concepts: ['tooling.tsconfig', 'ts.import-type'],
  mode: 'multiple',
  question:
    'Sinema’nın `tsconfig.app.json`’ında `verbatimModuleSyntax`, `erasableSyntaxOnly` ve `noUnusedLocals` açık. **Hangileri** `tsc -b`’de hata verir? (`Movie` bir interface.)',
  options: [
    {
      text: "`import { Movie } from './types'`",
      correct: true,
      explanation:
        'Movie sadece bir tip. verbatimModuleSyntax, `import type { Movie }` yazmanı ister.',
    },
    {
      text: '`enum Genre { Action, Comedy }`',
      correct: true,
      explanation:
        'enum çalışma zamanında nesne üretir; erasableSyntaxOnly bunu yasaklar. Yerine literal union kullanılır.',
    },
    {
      text: 'Fonksiyon içinde tanımlanıp hiç kullanılmayan `const debug = true`',
      correct: true,
      explanation: 'noUnusedLocals kullanılmayan yerel değişkeni hata sayar (ölü kod birikmesin).',
    },
    {
      text: "`import type { Movie } from './types'`",
      explanation: 'Tam da istenen yazım: sadece tip import’u, derlemede silinir.',
    },
    {
      text: "`type Genre = 'action' | 'comedy'`",
      explanation: 'Literal union tamamen tip düzeyindedir, silinebilir: sorun yok.',
    },
  ],
})
