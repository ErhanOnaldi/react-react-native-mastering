import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { createJiti } from 'jiti'
import { glob } from 'tinyglobby'
import { z } from 'zod'
import {
  conceptRegistrySchema,
  lessonFrontmatterSchema,
  moduleMetaSchema,
  questionMetaSchema,
  type ConceptRegistry,
} from './schema.ts'
import type { ContentError, Curriculum, LessonEntry, ModuleEntry, QuestionEntry } from './types.ts'

const DIR_PATTERN = /^(\d{2})-[a-z0-9-]+$/

// Önbelleksiz: içerik değiştiğinde yeniden yüklemek her zaman taze sonuç verir.
const jiti = createJiti(import.meta.url, { moduleCache: false, fsCache: false })

async function importDefault(file: string): Promise<unknown> {
  return jiti.import(file, { default: true })
}

async function listNumberedDirs(parent: string, errors: ContentError[]) {
  if (!existsSync(parent)) return []
  const entries = await readdir(parent, { withFileTypes: true })
  const dirs: { name: string; number: number; dir: string }[] = []
  const seen = new Map<number, string>()
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    const match = DIR_PATTERN.exec(entry.name)
    const dir = path.join(parent, entry.name)
    if (!match) {
      errors.push({ file: dir, message: `Klasör adı "NN-slug" biçiminde olmalı: ${entry.name}` })
      continue
    }
    const number = Number(match[1])
    const clash = seen.get(number)
    if (clash) {
      errors.push({
        file: dir,
        message: `Aynı numara iki kez kullanılmış: ${clash} ve ${entry.name}`,
      })
      continue
    }
    seen.set(number, entry.name)
    dirs.push({ name: entry.name, number, dir })
  }
  return dirs.sort((a, b) => a.number - b.number)
}

function zodMessage(error: z.ZodError) {
  return z.prettifyError(error)
}

async function listFiles(dir: string, patterns: string[] = ['**/*']) {
  if (!existsSync(dir)) return []
  const files = await glob(patterns, { cwd: dir, dot: false, onlyFiles: true })
  return files.sort()
}

async function loadConcepts(root: string, errors: ContentError[]): Promise<ConceptRegistry> {
  const file = path.join(root, 'concepts.ts')
  if (!existsSync(file)) {
    errors.push({ file, message: 'concepts.ts bulunamadı.' })
    return {}
  }
  try {
    const parsed = conceptRegistrySchema.safeParse(await importDefault(file))
    if (!parsed.success) {
      errors.push({ file, message: zodMessage(parsed.error) })
      return {}
    }
    return parsed.data
  } catch (error) {
    errors.push({ file, message: `Yüklenemedi: ${(error as Error).message}` })
    return {}
  }
}

async function loadQuestion(
  lesson: { id: string; code: string; moduleId: string },
  entry: { name: string; number: number; dir: string },
  concepts: ConceptRegistry,
  errors: ContentError[],
): Promise<QuestionEntry | undefined> {
  const file = path.join(entry.dir, 'question.ts')
  if (!existsSync(file)) {
    errors.push({ file, message: 'question.ts bulunamadı.' })
    return undefined
  }
  let raw: unknown
  try {
    raw = await importDefault(file)
  } catch (error) {
    errors.push({ file, message: `Yüklenemedi: ${(error as Error).message}` })
    return undefined
  }
  const parsed = questionMetaSchema.safeParse(raw)
  if (!parsed.success) {
    errors.push({ file, message: zodMessage(parsed.error) })
    return undefined
  }
  const meta = parsed.data

  for (const concept of meta.concepts) {
    if (!concepts[concept]) {
      errors.push({
        file,
        message: `Tanımsız kavram: "${concept}" (curriculum/concepts.ts'e ekleyin).`,
      })
    }
  }

  const promptPath = path.join(entry.dir, 'prompt.md')
  const solutionNotesPath = path.join(entry.dir, 'solution.md')
  const question: QuestionEntry = {
    id: `${lesson.id}/${entry.name}`,
    code: `${lesson.code}.${entry.number}`,
    number: entry.number,
    moduleId: lesson.moduleId,
    lessonId: lesson.id,
    dir: entry.dir,
    type: meta.type,
    meta,
    promptPath: existsSync(promptPath) ? promptPath : undefined,
    solutionNotesPath: existsSync(solutionNotesPath) ? solutionNotesPath : undefined,
    testFiles: [],
    starterFiles: [],
    solutionFiles: [],
    implFiles: [],
  }

  if (meta.type === 'code') {
    question.testFiles = await listFiles(entry.dir, ['*.test.ts', '*.test.tsx'])
    question.starterFiles = await listFiles(path.join(entry.dir, 'starter'))
    question.solutionFiles = await listFiles(path.join(entry.dir, 'solution'))
    question.implFiles = await listFiles(path.join(entry.dir, 'impl'))

    if (!question.promptPath) errors.push({ file, message: 'code görevinde prompt.md zorunlu.' })
    for (const f of meta.files) {
      if (!question.starterFiles.includes(f)) {
        errors.push({ file, message: `starter/${f} bulunamadı.` })
      }
      if (!question.solutionFiles.includes(f)) {
        errors.push({ file, message: `solution/${f} bulunamadı.` })
      }
    }
    if (meta.preview && !question.starterFiles.includes(meta.preview.entry)) {
      errors.push({ file, message: `Önizleme girişi starter/${meta.preview.entry} bulunamadı.` })
    }
    if (meta.testWriting) {
      if (question.implFiles.length === 0) {
        errors.push({ file, message: 'Test yazma görevinde impl/ klasörü dolu olmalı.' })
      }
      for (const mutant of meta.testWriting.mutants) {
        if (!existsSync(path.join(entry.dir, 'mutants', mutant.id))) {
          errors.push({ file, message: `mutants/${mutant.id}/ bulunamadı.` })
        }
      }
    } else if (question.testFiles.length === 0) {
      errors.push({ file, message: 'code görevinde en az bir *.test.ts(x) dosyası olmalı.' })
    }
  }

  if (meta.type === 'project') {
    question.testFiles = await listFiles(path.join(entry.dir, 'tests'), [
      '**/*.test.ts',
      '**/*.test.tsx',
    ])
    if (!question.promptPath) errors.push({ file, message: 'project görevinde prompt.md zorunlu.' })
    if (question.testFiles.length === 0 && !meta.rubric) {
      errors.push({
        file,
        message: 'project görevinde test ya da değerlendirme listesi (rubric) olmalı.',
      })
    }
  }

  return question
}

async function loadLesson(
  module: { id: string; code: string },
  entry: { name: string; number: number; dir: string },
  concepts: ConceptRegistry,
  errors: ContentError[],
): Promise<LessonEntry | undefined> {
  const markdownPath = path.join(entry.dir, 'lesson.md')
  if (!existsSync(markdownPath)) {
    errors.push({ file: markdownPath, message: 'lesson.md bulunamadı.' })
    return undefined
  }
  const { data } = matter(await readFile(markdownPath, 'utf8'))
  const parsed = lessonFrontmatterSchema.safeParse(data)
  if (!parsed.success) {
    errors.push({ file: markdownPath, message: zodMessage(parsed.error) })
    return undefined
  }
  const lesson: LessonEntry = {
    id: `${module.id}/${entry.name}`,
    code: `${module.code}.${entry.number}`,
    number: entry.number,
    moduleId: module.id,
    dir: entry.dir,
    frontmatter: parsed.data,
    markdownPath,
    questions: [],
  }
  const questionDirs = await listNumberedDirs(path.join(entry.dir, 'questions'), errors)
  for (const q of questionDirs) {
    const question = await loadQuestion(
      { id: lesson.id, code: lesson.code, moduleId: module.id },
      q,
      concepts,
      errors,
    )
    if (question) lesson.questions.push(question)
  }
  return lesson
}

export async function loadCurriculum(rootDir: string): Promise<Curriculum> {
  const root = path.resolve(rootDir)
  const errors: ContentError[] = []
  const concepts = await loadConcepts(root, errors)
  const modules: ModuleEntry[] = []

  for (const entry of await listNumberedDirs(path.join(root, 'modules'), errors)) {
    const file = path.join(entry.dir, 'module.ts')
    if (!existsSync(file)) {
      errors.push({ file, message: 'module.ts bulunamadı.' })
      continue
    }
    let raw: unknown
    try {
      raw = await importDefault(file)
    } catch (error) {
      errors.push({ file, message: `Yüklenemedi: ${(error as Error).message}` })
      continue
    }
    const parsed = moduleMetaSchema.safeParse(raw)
    if (!parsed.success) {
      errors.push({ file, message: zodMessage(parsed.error) })
      continue
    }
    const module: ModuleEntry = {
      id: entry.name,
      code: String(entry.number),
      number: entry.number,
      dir: entry.dir,
      meta: parsed.data,
      lessons: [],
    }
    for (const l of await listNumberedDirs(entry.dir, errors)) {
      const lesson = await loadLesson(module, l, concepts, errors)
      if (lesson) module.lessons.push(lesson)
    }
    modules.push(module)
  }

  return { root, modules, concepts, errors }
}
