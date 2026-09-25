import type { CurriculumDto, LessonSummaryDto, ModuleSummaryDto } from '@rm/server/dto'

export const PHASES: Record<number, string> = {
  1: 'Temeller',
  2: 'Profesyonel kod tabanı',
  3: 'Test',
  4: 'Veri, formlar ve state',
  5: 'İleri React ve kalite',
  6: 'Bitirme',
}

export interface Tally {
  passed: number
  total: number
  ratio: number
}

function tally(questions: { status: string }[]): Tally {
  const passed = questions.filter((q) => q.status === 'passed').length
  return {
    passed,
    total: questions.length,
    ratio: questions.length ? passed / questions.length : 0,
  }
}

export const lessonTally = (lesson: LessonSummaryDto) => tally(lesson.questions)
export const moduleTally = (module: ModuleSummaryDto) =>
  tally(module.lessons.flatMap((l) => l.questions))
export const overallTally = (curriculum: CurriculumDto) =>
  tally(curriculum.modules.flatMap((m) => m.lessons.flatMap((l) => l.questions)))

/** Önerilen sırada ilk tamamlanmamış soru. */
export function firstOpenQuestion(curriculum: CurriculumDto) {
  for (const m of curriculum.modules)
    for (const l of m.lessons) for (const q of l.questions) if (q.status !== 'passed') return q
  return undefined
}
