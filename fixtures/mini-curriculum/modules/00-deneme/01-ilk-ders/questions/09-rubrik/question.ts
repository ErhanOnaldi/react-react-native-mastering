import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Klasör yapısını tasarla',
  difficulty: 'zor',
  concepts: ['mini.react'],
  project: 'mini',
  reviewFiles: ['README.md'],
  rubric: ['Feature bazlı mı?', 'İsimler tutarlı mı?'],
})
