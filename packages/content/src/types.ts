import type {
  ConceptRegistry,
  LessonFrontmatter,
  ModuleMeta,
  QuestionMeta,
  QuestionType,
} from './schema.ts'

export interface ContentError {
  /** Hatanın ait olduğu dosya (mutlak yol) */
  file: string
  message: string
}

export interface QuestionEntry {
  /** `05-hooks/01-useeffect/02-istek-dongusu` */
  id: string
  /** `5.1.2` */
  code: string
  number: number
  moduleId: string
  lessonId: string
  /** Soru klasörünün mutlak yolu */
  dir: string
  type: QuestionType
  meta: QuestionMeta
  /** prompt.md varsa mutlak yolu */
  promptPath?: string
  /** solution.md varsa mutlak yolu */
  solutionNotesPath?: string
  /** code: soru klasöründeki test dosyaları · project: tests/ içindekiler (soru klasörüne göre) */
  testFiles: string[]
  /** code: starter/ içindeki dosyalar (starter/'a göre) */
  starterFiles: string[]
  /** code: solution/ içindeki dosyalar (solution/'a göre) */
  solutionFiles: string[]
  /** code + testWriting: impl/ içindeki dosyalar (impl/'e göre) */
  implFiles: string[]
}

export interface LessonEntry {
  /** `05-hooks/01-useeffect` */
  id: string
  /** `5.1` */
  code: string
  number: number
  moduleId: string
  dir: string
  frontmatter: LessonFrontmatter
  markdownPath: string
  questions: QuestionEntry[]
}

export interface ModuleEntry {
  /** `05-hooks` */
  id: string
  /** `5` */
  code: string
  number: number
  dir: string
  meta: ModuleMeta
  lessons: LessonEntry[]
}

export interface Curriculum {
  root: string
  modules: ModuleEntry[]
  concepts: ConceptRegistry
  errors: ContentError[]
}
