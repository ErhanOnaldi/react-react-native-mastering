import { z } from 'zod'

export const difficultySchema = z.enum(['kolay', 'orta', 'zor'])
export type Difficulty = z.infer<typeof difficultySchema>

export const conceptSchema = z.object({
  title: z.string().min(1),
  /** Core kavramlar için tekrar kuralı uygulanır (≥5 tekrar, ≥2 modül). */
  core: z.boolean().default(false),
})
export const conceptRegistrySchema = z.record(
  z.string().regex(/^[a-z0-9]+(\.[a-zA-Z0-9-]+)+$/, 'Kavram id biçimi: alan.kavram (örn. ts.omit)'),
  conceptSchema,
)
export type ConceptRegistry = z.infer<typeof conceptRegistrySchema>

export const moduleMetaSchema = z.object({
  title: z.string().min(1),
  phase: z.number().int().min(1).max(6),
  /** Pano ve modül kartında görünen 1–2 cümlelik özet. */
  summary: z.string().min(1),
  /** Modülü açan acı noktası hikayesi (markdown). */
  pain: z.string().min(1),
  outcomes: z.array(z.string().min(1)).min(1),
  optional: z.boolean().default(false),
})
export type ModuleMeta = z.infer<typeof moduleMetaSchema>

export const lessonKindSchema = z.enum(['concept', 'review', 'practice', 'project'])
export type LessonKind = z.infer<typeof lessonKindSchema>

export const lessonFrontmatterSchema = z.object({
  title: z.string().min(1),
  minutes: z.number().int().positive(),
  /** concept: normal ders · review: tekrar · practice: pekiştirme · project: proje görevi */
  kind: lessonKindSchema.default('concept'),
})
export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>

const questionBase = {
  title: z.string().min(1),
  difficulty: difficultySchema,
  concepts: z.array(z.string()).min(1),
}

const hintsSchema = z.array(z.string().min(1)).max(3).default([])
const rubricSchema = z.array(z.string().min(1)).min(1).optional()

export const quizOptionSchema = z.object({
  /** Markdown */
  text: z.string().min(1),
  correct: z.boolean().default(false),
  /** Bu şık neden doğru/yanlış (markdown). */
  explanation: z.string().min(1),
})

export const quizQuestionSchema = z
  .object({
    type: z.literal('quiz'),
    ...questionBase,
    /** Soru metni (markdown, kod bloğu içerebilir). */
    question: z.string().min(1),
    mode: z.enum(['single', 'multiple']).default('single'),
    options: z.array(quizOptionSchema).min(2).max(6),
    /** Cevaptan sonra gösterilen genel açıklama (markdown). */
    explanation: z.string().optional(),
  })
  .superRefine((q, ctx) => {
    const correct = q.options.filter((o) => o.correct).length
    if (q.mode === 'single' && correct !== 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: `Tek cevaplı soruda tam 1 doğru şık olmalı (şu an ${correct}).`,
      })
    }
    if (q.mode === 'multiple' && correct < 1) {
      ctx.addIssue({ code: 'custom', path: ['options'], message: 'En az 1 doğru şık olmalı.' })
    }
  })

export const mutantSchema = z.object({
  /** `mutants/<id>/` klasörü */
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Öğrenciye gösterilen ad, örn. "debounce süresini yok sayan versiyon" */
  label: z.string().min(1),
})

export const codeQuestionSchema = z.object({
  type: z.literal('code'),
  ...questionBase,
  /** Öğrencinin düzenleyeceği dosyalar (starter/ içine göre). Diğer starter dosyaları salt okunurdur. */
  files: z.array(z.string().min(1)).min(1),
  hints: hintsSchema,
  /** Canlı önizleme: entry dosyasının default export'u render edilir. */
  preview: z.object({ entry: z.string().min(1) }).optional(),
  rubric: rubricSchema,
  /** Review prompt'una girecek dosyalar (varsayılan: files). */
  reviewFiles: z.array(z.string()).optional(),
  /** Test yazma görevi: öğrencinin testleri impl/'de geçmeli, her mutant'ta kalmalı. */
  testWriting: z.object({ mutants: z.array(mutantSchema).min(1) }).optional(),
  timeoutMs: z.number().int().positive().max(120_000).optional(),
})

export const projectQuestionSchema = z.object({
  type: z.literal('project'),
  ...questionBase,
  /** projects/<project> */
  project: z.string().min(1).default('sinema'),
  hints: hintsSchema,
  rubric: rubricSchema,
  /** Görevde odaklanılacak dosyalar (VS Code'da açma linkleri). Proje köküne göre. */
  focusFiles: z.array(z.string()).default([]),
  /** Review prompt'una girecek dosyalar (glob, proje köküne göre). */
  reviewFiles: z.array(z.string()).default([]),
  timeoutMs: z.number().int().positive().max(300_000).optional(),
})

export const questionMetaSchema = z.discriminatedUnion('type', [
  quizQuestionSchema,
  codeQuestionSchema,
  projectQuestionSchema,
])

export type QuizQuestion = z.infer<typeof quizQuestionSchema>
export type CodeQuestion = z.infer<typeof codeQuestionSchema>
export type ProjectQuestion = z.infer<typeof projectQuestionSchema>
export type QuestionMeta = z.infer<typeof questionMetaSchema>
export type QuestionType = QuestionMeta['type']

export type ModuleMetaInput = z.input<typeof moduleMetaSchema>
export type QuestionMetaInput =
  | z.input<typeof quizQuestionSchema>
  | z.input<typeof codeQuestionSchema>
  | z.input<typeof projectQuestionSchema>
export type ConceptRegistryInput = z.input<typeof conceptRegistrySchema>
