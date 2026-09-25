// Sunucu ↔ platform sözleşmesi. Platform bu tipleri yalnızca `import type` ile kullanır.
import type { Difficulty, LessonKind, QuestionType } from '@rm/content'
import type { EditorFile, QuestionProgress, QuestionStatus, RunResult } from '@rm/runner'

export type { Difficulty, EditorFile, LessonKind, QuestionProgress, QuestionStatus, QuestionType, RunResult }

export interface ContentErrorDto {
  file: string
  message: string
}

export interface QuestionSummaryDto {
  id: string
  code: string
  title: string
  type: QuestionType
  difficulty: Difficulty
  status: QuestionStatus
}

export interface LessonSummaryDto {
  id: string
  code: string
  title: string
  minutes: number
  kind: LessonKind
  questions: QuestionSummaryDto[]
}

export interface ModuleSummaryDto {
  id: string
  code: string
  number: number
  title: string
  phase: number
  summary: string
  optional: boolean
  lessons: LessonSummaryDto[]
}

export interface CurriculumDto {
  modules: ModuleSummaryDto[]
  lastVisited?: { code: string; title: string }
  errors: ContentErrorDto[]
  env: { tmdbToken: boolean }
}

export interface ModuleDto extends ModuleSummaryDto {
  painHtml: string
  outcomes: string[]
}

export interface NavRef {
  code: string
  title: string
}

export interface LessonDto extends LessonSummaryDto {
  html: string
  module: NavRef
  previous?: NavRef
  next?: NavRef
}

interface QuestionBaseDto {
  id: string
  code: string
  title: string
  difficulty: Difficulty
  concepts: { id: string; title: string }[]
  module: NavRef
  lesson: NavRef
  previous?: NavRef
  next?: NavRef
  progress: QuestionProgress
  hintCount: number
}

export interface QuizQuestionDto extends QuestionBaseDto {
  type: 'quiz'
  questionHtml: string
  mode: 'single' | 'multiple'
  options: { index: number; html: string }[]
}

export interface CodeQuestionDto extends QuestionBaseDto {
  type: 'code'
  promptHtml: string
  files: EditorFile[]
  /** Monaco'daki model yolları için: workspace klasörünün soru id'si */
  workspacePath: string
  preview?: { entry: string }
  hasRubric: boolean
  mutants?: { id: string; label: string }[]
  hasSolutionNotes: boolean
  lastResult?: RunResult
}

export interface ProjectQuestionDto extends QuestionBaseDto {
  type: 'project'
  promptHtml: string
  project: string
  projectDir: string
  focusFiles: { path: string; absolutePath: string }[]
  hasTests: boolean
  hasRubric: boolean
  command: string
  lastResult?: RunResult
}

export type QuestionDto = QuizQuestionDto | CodeQuestionDto | ProjectQuestionDto

export interface AnswerResultDto {
  correct: boolean
  options: { index: number; correct: boolean; selected: boolean; explanationHtml: string }[]
  explanationHtml?: string
  progress: QuestionProgress
}

export interface RunResponseDto {
  result: RunResult
  progress: QuestionProgress
  next?: NavRef
}

export interface HintsDto {
  hints: string[]
  total: number
}

export interface SolutionDto {
  files: { name: string; content: string }[]
  notesHtml?: string
}

export interface ReviewPromptDto {
  prompt: string
  chars: number
  warn: boolean
}

export type ServerEvent =
  | { type: 'file-changed'; questionId: string; file: string }
  | { type: 'curriculum-changed' }
