import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { QuestionEntry } from '@rm/content'
import type { RepoPaths } from './paths.ts'

export type EditorFileKind = 'code' | 'test' | 'impl'

export interface EditorFile {
  /** Görünen ad / yol (örn. `sum.ts`) */
  name: string
  content: string
  editable: boolean
  kind: EditorFileKind
}

export function workspaceDir(paths: RepoPaths, question: QuestionEntry) {
  return path.join(paths.workspaceRoot, question.id)
}

function editableFiles(question: QuestionEntry): string[] {
  return question.meta.type === 'code' ? question.meta.files : []
}

/** Soru ilk açıldığında starter/ dosyalarını workspace'e kopyalar (var olanlara dokunmaz). */
export async function ensureWorkspace(paths: RepoPaths, question: QuestionEntry): Promise<string> {
  const dir = workspaceDir(paths, question)
  if (question.type !== 'code') return dir
  for (const file of question.starterFiles) {
    const target = path.join(dir, file)
    if (existsSync(target)) continue
    await mkdir(path.dirname(target), { recursive: true })
    await copyFile(path.join(question.dir, 'starter', file), target)
  }
  return dir
}

/** "Sıfırla": workspace'i siler ve başlangıç kodunu yeniden kopyalar. */
export async function resetWorkspace(paths: RepoPaths, question: QuestionEntry) {
  await rm(workspaceDir(paths, question), { recursive: true, force: true })
  return ensureWorkspace(paths, question)
}

/**
 * Salt okunur starter dosyalarını (öğrencinin düzenlemediği yardımcı dosyalar) her çalıştırmadan
 * önce orijinalinden geri yükler; böylece yanlışlıkla değiştirilmiş olsalar da testler tutarlı kalır.
 */
export async function restoreReadonlyFiles(paths: RepoPaths, question: QuestionEntry) {
  const editable = new Set(editableFiles(question))
  const dir = workspaceDir(paths, question)
  for (const file of question.starterFiles) {
    if (editable.has(file)) continue
    const target = path.join(dir, file)
    await mkdir(path.dirname(target), { recursive: true })
    await copyFile(path.join(question.dir, 'starter', file), target)
  }
}

function safeJoin(base: string, name: string) {
  const full = path.resolve(base, name)
  if (!full.startsWith(path.resolve(base) + path.sep)) {
    throw new Error(`Geçersiz dosya yolu: ${name}`)
  }
  return full
}

export async function writeWorkspaceFile(
  paths: RepoPaths,
  question: QuestionEntry,
  name: string,
  content: string,
) {
  if (!editableFiles(question).includes(name)) {
    throw new Error(`Bu dosya düzenlenemez: ${name}`)
  }
  const target = safeJoin(workspaceDir(paths, question), name)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content)
}

export async function readWorkspaceFile(paths: RepoPaths, question: QuestionEntry, name: string) {
  return readFile(safeJoin(workspaceDir(paths, question), name), 'utf8')
}

/** Editörde gösterilecek dosyalar: düzenlenebilirler önce, sonra salt okunurlar. */
export async function listEditorFiles(
  paths: RepoPaths,
  question: QuestionEntry,
): Promise<EditorFile[]> {
  if (question.meta.type !== 'code') return []
  await ensureWorkspace(paths, question)
  const dir = workspaceDir(paths, question)
  const editable = new Set(question.meta.files)
  const files: EditorFile[] = []

  for (const name of question.meta.files) {
    files.push({
      name,
      content: await readFile(path.join(dir, name), 'utf8'),
      editable: true,
      kind: 'code',
    })
  }
  for (const name of question.starterFiles) {
    if (editable.has(name)) continue
    const content = await readFile(path.join(question.dir, 'starter', name), 'utf8')
    files.push({ name, content, editable: false, kind: 'code' })
  }
  if (question.meta.testWriting) {
    for (const name of question.implFiles) {
      const content = await readFile(path.join(question.dir, 'impl', name), 'utf8')
      files.push({ name: `impl/${name}`, content, editable: false, kind: 'impl' })
    }
  } else {
    for (const name of question.testFiles) {
      const content = await readFile(path.join(question.dir, name), 'utf8')
      files.push({ name, content, editable: false, kind: 'test' })
    }
  }
  return files
}

/** Çözüm dosyaları (salt okunur gösterim için). */
export async function readSolutionFiles(question: QuestionEntry) {
  const files: { name: string; content: string }[] = []
  for (const name of question.solutionFiles) {
    files.push({ name, content: await readFile(path.join(question.dir, 'solution', name), 'utf8') })
  }
  return files
}
