import path from 'node:path'
import { findQuestion, loadCurriculum } from '@rm/content'
import {
  readProgress,
  recordAttempt,
  runQuestion,
  saveLastResult,
  workspaceDir,
  type RepoPaths,
} from '@rm/runner'
import { watch } from 'chokidar'
import pc from 'picocolors'
import { printHeader, printResult } from './print.ts'

export async function check(paths: RepoPaths, code: string | undefined, options: { watch: boolean }) {
  const curriculum = await loadCurriculum(paths.curriculumRoot)
  const target = code ?? (await readProgress(paths.progressFile)).lastVisited
  if (!target) {
    console.error(pc.red('Hangi soru? Örnek: pnpm check 5.1.2 (ya da önce platformda bir soru aç)'))
    return 1
  }
  const question = findQuestion(curriculum, target)
  if (!question) {
    console.error(pc.red(`Soru bulunamadı: ${target}`))
    return 1
  }
  if (question.type === 'quiz') {
    console.log(pc.yellow(`${question.code} bir quiz sorusu; platformda cevaplanır.`))
    return 0
  }
  if (question.type === 'project' && question.testFiles.length === 0) {
    console.log(
      pc.yellow(`${question.code} testsiz bir görev: platformdaki review prompt'unu kullan, sonra "Tamamladım" de.`),
    )
    return 0
  }

  const once = async () => {
    printHeader(question)
    console.log(pc.dim('  çalışıyor…'))
    const result = await runQuestion(paths, question)
    await saveLastResult(paths, question.id, result)
    await recordAttempt(paths.progressFile, question.id, result.status === 'passed')
    printResult(result)
    return result.status === 'passed' ? 0 : 1
  }

  const code_ = await once()
  if (!options.watch) return code_

  const meta = question.meta
  const watched =
    meta.type === 'project'
      ? path.join(paths.projectsRoot, meta.project, 'src')
      : workspaceDir(paths, question)
  console.log(pc.dim(`  👀 ${path.relative(paths.repoRoot, watched)} izleniyor (çıkmak için Ctrl+C)`))
  let timer: NodeJS.Timeout | undefined
  let running = false
  watch(watched, { ignoreInitial: true, ignored: /node_modules/ }).on('all', () => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      if (running) return
      running = true
      await once().finally(() => (running = false))
    }, 300)
  })
  return new Promise<number>(() => {})
}
