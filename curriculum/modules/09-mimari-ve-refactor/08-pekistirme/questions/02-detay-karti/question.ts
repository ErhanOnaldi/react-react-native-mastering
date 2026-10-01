import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay görünümünü sadeleştir',
  difficulty: 'zor',
  concepts: [
    'arch.refactoring',
    'arch.component-api',
    'react.composition',
    'ts.optional-nullable',
    'react.components',
  ],
  files: ['MovieSummary.tsx', 'MoviePoster.tsx'],
  hints: [
    'Poster opsiyoneldir; başlık ve açıklama iki durumda da aynıdır.',
    '`MoviePoster` null path için görsel üretmesin; diğer durumda URL ve alt metni kur.',
    '`MovieSummary` iki ayrı article gövdesi yerine `MoviePoster` kullanıp başlık/açıklamayı bir kez çizsin.',
  ],
  rubric: [
    '`MoviePoster` dolu path için doğru URL ve film başlığı alt metnini verir, null path için görsel çizmez.',
    '`MovieSummary` hem posterli hem postersiz durumda aynı başlık/açıklama yapısını korur.',
    '`MovieSummary` poster davranışı için `MoviePoster` bileşenini kullanır.',
  ],
})
