import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type QuestionStatus = 'not-started' | 'in-progress' | 'passed'

export interface QuestionProgress {
  status: QuestionStatus
  attempts: number
  hintsUsed: number
  solutionViewed: boolean
  firstPassedAt?: string
  updatedAt: string
}

export interface Progress {
  version: 1
  questions: Record<string, QuestionProgress>
  lastVisited?: string
}

export const emptyQuestionProgress = (): QuestionProgress => ({
  status: 'not-started',
  attempts: 0,
  hintsUsed: 0,
  solutionViewed: false,
  updatedAt: new Date(0).toISOString(),
})

export async function readProgress(file: string): Promise<Progress> {
  if (!existsSync(file)) return { version: 1, questions: {} }
  try {
    const data = JSON.parse(await readFile(file, 'utf8')) as Progress
    return { version: 1, questions: data.questions ?? {}, lastVisited: data.lastVisited }
  } catch {
    return { version: 1, questions: {} }
  }
}

// Aynı süreç içindeki eşzamanlı güncellemeleri sıraya koyar (oku-değiştir-yaz yarışını önler).
let queue: Promise<unknown> = Promise.resolve()

async function writeAtomic(file: string, progress: Progress) {
  const tmp = `${file}.${process.pid}.tmp`
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(tmp, JSON.stringify(progress, null, 2) + '\n')
  await rename(tmp, file)
}

export function updateProgress(
  file: string,
  mutate: (progress: Progress) => void,
): Promise<Progress> {
  const next = queue.then(async () => {
    const progress = await readProgress(file)
    mutate(progress)
    await writeAtomic(file, progress)
    return progress
  })
  queue = next.catch(() => undefined)
  return next
}

function touch(progress: Progress, id: string): QuestionProgress {
  const entry = progress.questions[id] ?? emptyQuestionProgress()
  entry.updatedAt = new Date().toISOString()
  progress.questions[id] = entry
  return entry
}

export function recordVisit(file: string, id: string) {
  return updateProgress(file, (p) => {
    p.lastVisited = id
  })
}

/** Bir çalıştırmanın ya da quiz cevabının sonucunu işler. */
export function recordAttempt(file: string, id: string, passed: boolean) {
  return updateProgress(file, (p) => {
    const entry = touch(p, id)
    entry.attempts += 1
    if (passed) {
      if (entry.status !== 'passed') entry.firstPassedAt = entry.updatedAt
      entry.status = 'passed'
    } else if (entry.status === 'not-started') {
      entry.status = 'in-progress'
    }
  })
}

/** Değerlendirme listesiyle tamamlanan (testsiz) görevler için "Tamamladım". */
export function markDone(file: string, id: string, done: boolean) {
  return updateProgress(file, (p) => {
    const entry = touch(p, id)
    if (done) {
      if (entry.status !== 'passed') entry.firstPassedAt = entry.updatedAt
      entry.status = 'passed'
    } else {
      entry.status = 'in-progress'
      delete entry.firstPassedAt
    }
  })
}

export function recordHint(file: string, id: string, hintsUsed: number) {
  return updateProgress(file, (p) => {
    const entry = touch(p, id)
    entry.hintsUsed = Math.max(entry.hintsUsed, hintsUsed)
    if (entry.status === 'not-started') entry.status = 'in-progress'
  })
}

export function recordSolutionView(file: string, id: string) {
  return updateProgress(file, (p) => {
    const entry = touch(p, id)
    // Görev geçildikten sonra çözüme bakmak "kopya" sayılmaz.
    if (entry.status !== 'passed') entry.solutionViewed = true
  })
}
