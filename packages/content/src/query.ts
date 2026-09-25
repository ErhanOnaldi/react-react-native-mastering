import type { Curriculum, LessonEntry, ModuleEntry, QuestionEntry } from './types.ts'

export function allLessons(curriculum: Curriculum): LessonEntry[] {
  return curriculum.modules.flatMap((m) => m.lessons)
}

export function allQuestions(curriculum: Curriculum): QuestionEntry[] {
  return allLessons(curriculum).flatMap((l) => l.questions)
}

/** Soru id'si (`05-hooks/01-x/02-y`) ya da kısa kod (`5.1.2`) ile bulur. */
export function findQuestion(curriculum: Curriculum, idOrCode: string): QuestionEntry | undefined {
  return allQuestions(curriculum).find((q) => q.id === idOrCode || q.code === idOrCode)
}

export function findLesson(curriculum: Curriculum, idOrCode: string): LessonEntry | undefined {
  return allLessons(curriculum).find((l) => l.id === idOrCode || l.code === idOrCode)
}

export function findModule(curriculum: Curriculum, idOrCode: string): ModuleEntry | undefined {
  return curriculum.modules.find((m) => m.id === idOrCode || m.code === idOrCode)
}

/** Önerilen sırada bir sonraki soru. */
export function nextQuestion(curriculum: Curriculum, id: string): QuestionEntry | undefined {
  const questions = allQuestions(curriculum)
  const index = questions.findIndex((q) => q.id === id)
  return index === -1 ? undefined : questions[index + 1]
}

export function previousQuestion(curriculum: Curriculum, id: string): QuestionEntry | undefined {
  const questions = allQuestions(curriculum)
  const index = questions.findIndex((q) => q.id === id)
  return index <= 0 ? undefined : questions[index - 1]
}
