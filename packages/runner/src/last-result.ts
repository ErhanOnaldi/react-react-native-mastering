import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { RepoPaths } from './paths.ts'
import type { RunResult } from './result.ts'

// Son çalıştırma sonucu diskte tutulur: platform ve CLI (pnpm check) aynı sonucu görür,
// review prompt'u her ikisinden de beslenir.
const fileFor = (paths: RepoPaths, questionId: string) =>
  path.join(paths.cacheDir, 'results', `${questionId.replaceAll('/', '__')}.json`)

export async function saveLastResult(paths: RepoPaths, questionId: string, result: RunResult) {
  const file = fileFor(paths, questionId)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify({ at: new Date().toISOString(), result }))
}

export async function loadLastResult(
  paths: RepoPaths,
  questionId: string,
): Promise<{ at: string; result: RunResult } | undefined> {
  const file = fileFor(paths, questionId)
  if (!existsSync(file)) return undefined
  try {
    return JSON.parse(await readFile(file, 'utf8')) as { at: string; result: RunResult }
  } catch {
    return undefined
  }
}
