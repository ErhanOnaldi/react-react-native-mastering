// Geçici yardımcı: bir soruyu verilen hedefte çalıştırıp test sonuçlarını yazdırır.
// Kullanım: node run-q.ts <kısa-kod> <starter|solution|/mutlak/hedef>
import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { findQuestion, loadCurriculum } from '../../../../packages/content/src/index.ts'
import { resolvePaths, runQuestion } from '../../../../packages/runner/src/index.ts'

const repoRoot = path.resolve(import.meta.dirname, '../../../..')
const paths = resolvePaths(repoRoot)
const [code, which = 'solution', overlay] = process.argv.slice(2)
const curriculum = await loadCurriculum(paths.curriculumRoot)
const question = findQuestion(curriculum, code!)
if (!question) throw new Error('soru yok: ' + code)
let target = which
if (which === 'starter') target = path.join(question.dir, 'starter')
if (which === 'solution') {
  target = path.join(import.meta.dirname, 'targets', code!.replaceAll('.', '_'))
  await rm(target, { recursive: true, force: true })
  await mkdir(target, { recursive: true })
  await cp(path.join(question.dir, 'starter'), target, { recursive: true })
  await cp(path.join(question.dir, 'solution'), target, { recursive: true, force: true })
}
if (overlay) {
  // overlay: dosya yolu → hedefte aynı ada sahip dosyanın üstüne yaz
  const { basename } = path
  const dest = path.join(import.meta.dirname, 'targets', code!.replaceAll('.', '_') + '_overlay')
  await rm(dest, { recursive: true, force: true })
  await mkdir(dest, { recursive: true })
  await cp(path.join(question.dir, 'starter'), dest, { recursive: true })
  const name = basename(overlay).replace(/^[^.]+\./, '')
  await cp(overlay, path.join(dest, name))
  target = dest
}
const started = Date.now()
const result = await runQuestion(paths, question, {
  target,
  timeoutScale: Number(process.env.SCALE ?? 1),
})
console.log(
  `${code} [${which}] → ${result.status} (${Date.now() - started} ms) ${result.summary ?? ''}`,
)
for (const t of result.tests)
  console.log(
    `  ${t.status === 'passed' ? '✓' : '✗'} ${t.fullName}${t.message ? '\n      ' + t.message.split('\n').slice(0, 4).join('\n      ') : ''}`,
  )
for (const e of result.typeErrors) console.log(`  ⚠ ${e.file}:${e.line} ${e.message}`)
if (result.output) console.log(result.output.slice(0, 3000))
