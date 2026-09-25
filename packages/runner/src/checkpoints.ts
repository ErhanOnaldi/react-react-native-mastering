import { existsSync } from 'node:fs'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { RepoPaths } from './paths.ts'

export interface Checkpoint {
  /** `start` ya da modül numarası (`07`) */
  label: string
  /** start = -1 */
  number: number
  dir: string
}

/**
 * curriculum/checkpoints/<proje>/start  → projenin ilk hali (iskelet)
 * curriculum/checkpoints/<proje>/NN     → NN numaralı modülün sonundaki doğrulanmış hali
 */
export async function listCheckpoints(paths: RepoPaths, project: string): Promise<Checkpoint[]> {
  const root = path.join(paths.curriculumRoot, 'checkpoints', project)
  if (!existsSync(root)) return []
  const entries = await readdir(root, { withFileTypes: true })
  return entries
    .filter((e) => e.isDirectory() && (e.name === 'start' || /^\d{2}$/.test(e.name)))
    .map((e) => ({
      label: e.name,
      number: e.name === 'start' ? -1 : Number(e.name),
      dir: path.join(root, e.name),
    }))
    .sort((a, b) => a.number - b.number)
}

/** Modülün sonundaki checkpoint (yoksa undefined). */
export async function checkpointAfter(paths: RepoPaths, project: string, moduleNumber: number) {
  return (await listCheckpoints(paths, project)).find((c) => c.number === moduleNumber)
}

/** Modülün başındaki durum: numarası modülden küçük en son checkpoint (ya da start). */
export async function checkpointBefore(paths: RepoPaths, project: string, moduleNumber: number) {
  const before = (await listCheckpoints(paths, project)).filter((c) => c.number < moduleNumber)
  return before.at(-1)
}

const SKIP = new Set([
  'node_modules',
  'dist',
  '.vite',
  'coverage',
  'test-results',
  'playwright-report',
])

/** Proje klasörünü (node_modules vb. hariç) kopyalar; istenirse package.json adını değiştirir. */
export async function copyProject(
  src: string,
  dest: string,
  options: { packageName?: string } = {},
) {
  await rm(dest, { recursive: true, force: true })
  await cp(src, dest, {
    recursive: true,
    filter: (source) => !SKIP.has(path.basename(source)),
  })
  if (options.packageName) {
    const pkgFile = path.join(dest, 'package.json')
    if (existsSync(pkgFile)) {
      const pkg = JSON.parse(await readFile(pkgFile, 'utf8')) as { name?: string }
      pkg.name = options.packageName
      await writeFile(pkgFile, JSON.stringify(pkg, null, 2) + '\n')
    }
  }
}
