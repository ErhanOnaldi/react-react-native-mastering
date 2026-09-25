import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { QuestionEntry } from '@rm/content'
import { glob } from 'tinyglobby'
import type { RepoPaths } from './paths.ts'
import type { RunResult } from './result.ts'
import { workspaceDir } from './workspace.ts'

/** Bu boyutun üstündeki prompt'larda arayüz uyarı gösterir. */
export const REVIEW_PROMPT_WARN_CHARS = 60_000
const MAX_FILE_CHARS = 20_000

const FENCE: Record<string, string> = {
  ts: 'ts',
  tsx: 'tsx',
  js: 'js',
  jsx: 'jsx',
  json: 'json',
  css: 'css',
  md: 'md',
  html: 'html',
  yml: 'yaml',
  yaml: 'yaml',
}

export interface ReviewFile {
  path: string
  content: string
}

/** Görevin review'a girecek dosyalarını toplar (code: workspace, project: proje klasörü). */
export async function collectReviewFiles(
  paths: RepoPaths,
  question: QuestionEntry,
): Promise<ReviewFile[]> {
  const meta = question.meta
  if (meta.type === 'quiz') return []
  const root =
    meta.type === 'project' ? path.join(paths.projectsRoot, meta.project) : workspaceDir(paths, question)
  const patterns =
    meta.type === 'project' ? meta.reviewFiles : (meta.reviewFiles ?? meta.files)
  if (patterns.length === 0) return []
  const files = await glob(patterns, {
    cwd: root,
    onlyFiles: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  })
  const result: ReviewFile[] = []
  for (const file of files.sort()) {
    let content = await readFile(path.join(root, file), 'utf8').catch(() => '')
    if (content.length > MAX_FILE_CHARS) {
      content = `${content.slice(0, MAX_FILE_CHARS)}\n… (dosya kısaltıldı)`
    }
    result.push({ path: file, content })
  }
  return result
}

function formatResult(result: RunResult) {
  const lines = [`Durum: ${result.summary}`]
  for (const t of result.tests) {
    lines.push(`- ${t.status === 'passed' ? '✅' : t.status === 'failed' ? '❌' : '⏭️'} ${t.fullName}`)
  }
  for (const e of result.typeErrors) {
    lines.push(`- ⚠️ Tip hatası ${e.file}:${e.line} ${e.code}: ${e.message.split('\n')[0]}`)
  }
  for (const m of result.mutants ?? []) {
    lines.push(`- ${m.caught ? '✅ yakalandı' : '❌ kaçtı'}: ${m.label}`)
  }
  return lines.join('\n')
}

export function buildReviewPrompt(input: {
  question: QuestionEntry
  task: string
  files: ReviewFile[]
  lastResult?: RunResult
}): string {
  const { question, task, files, lastResult } = input
  const meta = question.meta
  const rubric = meta.type === 'quiz' ? [] : (meta.rubric ?? [])
  const sections = [
    'Sen kıdemli bir React/TypeScript geliştiricisisin. Junior bir geliştiricinin, bir öğrenme platformundaki görev için yazdığı kodu inceliyorsun. Amacın onu sektör standardına taşımak: dürüst, somut ve öğretici ol.',
    `## Görev (${question.code} · ${meta.title})\n\n${task.trim()}`,
  ]
  if (rubric.length > 0) {
    sections.push(`## Değerlendirme listesi\n\n${rubric.map((r, i) => `${i + 1}. ${r}`).join('\n')}`)
  }
  sections.push(
    `## Kodum\n\n${
      files.length === 0
        ? '(Dosya bulunamadı.)'
        : files
            .map((f) => {
              const ext = path.extname(f.path).slice(1)
              return `### ${f.path}\n\n\`\`\`${FENCE[ext] ?? ''}\n${f.content.trimEnd()}\n\`\`\``
            })
            .join('\n\n')
    }`,
  )
  if (lastResult) sections.push(`## Son test sonuçları\n\n${formatResult(lastResult)}`)
  sections.push(
    [
      '## Cevap formatı',
      '',
      rubric.length > 0
        ? '- Değerlendirme listesindeki her kriter için ✅ / ⚠️ / ❌ ve 1–2 cümlelik gerekçe.'
        : '- Kodun güçlü ve zayıf yanları (kısa maddeler).',
      '- En önemli 3 iyileştirme; her biri için sektörde nasıl yapıldığını gösteren kısa bir örnek.',
      '- Tam çözümü yazma. Önce yönlendirici ipuçları ver; ben tekrar denedikten sonra isterse çözümü tartışırız.',
      '- Türkçe cevap ver; teknik terimleri (hook, props, state vb.) İngilizce bırakabilirsin.',
    ].join('\n'),
  )
  return sections.join('\n\n')
}
