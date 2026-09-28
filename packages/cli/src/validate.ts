import { existsSync } from 'node:fs'
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  allLessons,
  allQuestions,
  loadCurriculum,
  type Curriculum,
  type QuestionEntry,
} from '@rm/content'
import { checkDiagrams, checkSvg, extractCheckedCodeBlocks } from '@rm/content/markdown'
import {
  checkpointAfter,
  checkpointBefore,
  copyProject,
  runQuestion,
  type RepoPaths,
  type RunResult,
} from '@rm/runner'
import { spawn } from 'node:child_process'
import pc from 'picocolors'
import { knownDiagramClasses, lintDiagramLayout, unknownDiagramClasses } from './diagram-lint.ts'

interface Problem {
  where: string
  message: string
}

export interface ValidateOptions {
  module?: number
  /** Test çalıştırmalarını atla (yalnızca şema + kod blokları + kavram raporu) */
  skipRuns: boolean
  /** Proje görevlerini atla (checkpoint'ler henüz yokken) */
  skipProjects: boolean
  /** Kavram tekrar kuralını hata say */
  strictConcepts: boolean
  concurrency: number
}

async function pool<T>(items: T[], limit: number, work: (item: T) => Promise<void>) {
  const queue = [...items]
  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, async () => {
      while (queue.length) await work(queue.shift()!)
    }),
  )
}

const rel = (paths: RepoPaths, file: string) => path.relative(paths.repoRoot, file)

function describeFailure(result: RunResult) {
  const failed = result.tests
    .filter((t) => t.status === 'failed')
    .map((t) => `✗ ${t.fullName}: ${t.message?.split('\n')[0] ?? ''}`)
  const types = result.typeErrors.map(
    (e) => `⚠ ${e.file}:${e.line} ${e.code} ${e.message.split('\n')[0]}`,
  )
  const mutants = (result.mutants ?? [])
    .filter((m) => !m.caught)
    .map((m) => `✗ mutant kaçtı: ${m.label}`)
  return [result.summary, ...failed, ...types, ...mutants, result.output ?? '']
    .filter(Boolean)
    .join('\n    ')
}

async function validateCode(paths: RepoPaths, question: QuestionEntry, problems: Problem[]) {
  const meta = question.meta
  if (meta.type !== 'code') return
  const where = `${question.code} ${rel(paths, question.dir)}`
  const scratch = path.join(paths.cacheDir, 'validate', question.id.replaceAll('/', '__'))
  await rm(scratch, { recursive: true, force: true })

  // Çözüm: test yazmada doğrudan solution/ (testler), normal görevde starter + solution birleşimi
  let solutionTarget = path.join(question.dir, 'solution')
  if (!meta.testWriting) {
    solutionTarget = path.join(scratch, 'solution')
    await mkdir(solutionTarget, { recursive: true })
    await cp(path.join(question.dir, 'starter'), solutionTarget, { recursive: true })
    await cp(path.join(question.dir, 'solution'), solutionTarget, { recursive: true, force: true })
  }
  const [solution, starter] = await Promise.all([
    runQuestion(paths, question, { target: solutionTarget, timeoutScale: 3 }),
    runQuestion(paths, question, { target: path.join(question.dir, 'starter'), timeoutScale: 3 }),
  ])
  if (solution.status !== 'passed') {
    problems.push({ where, message: `Çözüm geçmiyor:\n    ${describeFailure(solution)}` })
  }
  if (starter.status === 'passed') {
    problems.push({ where, message: 'Başlangıç kodu testleri zaten geçiyor (görev boş).' })
  }
}

/** Checkpoint'in kendi test paketi (varsa) — referans çözüm kendi testlerini de geçmeli. */
async function runCheckpointOwnTests(paths: RepoPaths, dir: string): Promise<string | undefined> {
  const pkgFile = path.join(dir, 'package.json')
  const pkg = JSON.parse(await readFile(pkgFile, 'utf8').catch(() => '{}')) as {
    scripts?: Record<string, string>
  }
  if (!pkg.scripts?.test?.includes('vitest')) return undefined
  return new Promise((resolve) => {
    const child = spawn(path.join(paths.repoRoot, 'node_modules', '.bin', 'vitest'), ['run'], {
      cwd: dir,
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1', CI: '1' },
    })
    let out = ''
    child.stdout.on('data', (c: Buffer) => (out += c.toString()))
    child.stderr.on('data', (c: Buffer) => (out += c.toString()))
    const timer = setTimeout(() => child.kill('SIGKILL'), 300_000)
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve(code === 0 ? undefined : out.trim().split('\n').slice(-25).join('\n    '))
    })
  })
}

const checkedOwnTests = new Set<string>()

async function validateProject(
  paths: RepoPaths,
  question: QuestionEntry,
  moduleNumber: number,
  problems: Problem[],
) {
  const meta = question.meta
  if (meta.type !== 'project' || question.testFiles.length === 0) return
  const where = `${question.code} ${rel(paths, question.dir)}`
  const after = await checkpointAfter(paths, meta.project, moduleNumber)
  if (!after) {
    problems.push({
      where,
      message: `checkpoints/${meta.project}/${String(moduleNumber).padStart(2, '0')} bulunamadı.`,
    })
    return
  }
  const before = await checkpointBefore(paths, meta.project, moduleNumber)
  const scratch = path.join(paths.cacheDir, 'validate', 'projects')
  const afterDir = path.join(
    scratch,
    `${meta.project}-${after.label}-${question.id.replaceAll('/', '__')}`,
  )
  await copyProject(after.dir, afterDir)
  const result = await runQuestion(paths, question, { target: afterDir, timeoutScale: 3 })
  if (result.status !== 'passed') {
    problems.push({
      where,
      message: `Checkpoint ${after.label} testleri geçmiyor:\n    ${describeFailure(result)}`,
    })
  }
  if (!checkedOwnTests.has(after.dir)) {
    checkedOwnTests.add(after.dir)
    const ownFailure = await runCheckpointOwnTests(paths, afterDir)
    if (ownFailure) {
      problems.push({
        where: `checkpoints/${meta.project}/${after.label}`,
        message: `Checkpoint'in kendi testleri geçmiyor:\n    ${ownFailure}`,
      })
    }
  }
  if (before) {
    const beforeDir = path.join(
      scratch,
      `${meta.project}-${before.label}-${question.id.replaceAll('/', '__')}-before`,
    )
    await copyProject(before.dir, beforeDir)
    const early = await runQuestion(paths, question, { target: beforeDir, timeoutScale: 3 })
    if (early.status === 'passed') {
      problems.push({
        where,
        message: `Görev, modül başındaki checkpoint (${before.label}) ile zaten geçiyor.`,
      })
    }
  }
}

/** ```ts check blokları: her blok ayrı bir modül olarak derlenir. */
async function validateCodeBlocks(
  paths: RepoPaths,
  curriculum: Curriculum,
  moduleFilter: number | undefined,
  problems: Problem[],
) {
  const sources: string[] = []
  for (const lesson of allLessons(curriculum)) {
    const module = curriculum.modules.find((m) => m.id === lesson.moduleId)!
    if (moduleFilter !== undefined && module.number !== moduleFilter) continue
    sources.push(lesson.markdownPath)
    for (const q of lesson.questions) {
      if (q.promptPath) sources.push(q.promptPath)
      if (q.solutionNotesPath) sources.push(q.solutionNotesPath)
    }
  }
  // Çalıştırma başına ayrı klasör: paralel doğrulamalar birbirinin dosyalarını silmesin
  const dir = path.join(paths.cacheDir, 'validate', `blocks-${process.pid}-${Date.now()}`)
  await rm(dir, { recursive: true, force: true })
  await mkdir(dir, { recursive: true })
  const map = new Map<string, { source: string; line: number }>()
  let n = 0
  for (const source of sources) {
    for (const block of extractCheckedCodeBlocks(await readFile(source, 'utf8'))) {
      const file = path.join(dir, `block-${++n}.${block.lang}`)
      await writeFile(file, block.code + '\n')
      map.set(file, { source, line: block.line })
    }
  }
  if (map.size === 0) return 0
  await writeFile(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify({
      extends: path.join(paths.testEnvDir, 'tsconfig.exercise.json'),
      compilerOptions: { noUnusedLocals: false },
      files: [...map.keys(), path.join(paths.testEnvDir, 'env.d.ts')],
    }),
  )
  const output = await new Promise<string>((resolve) => {
    const child = spawn(
      path.join(paths.repoRoot, 'node_modules', '.bin', 'tsc'),
      ['-p', path.join(dir, 'tsconfig.json'), '--noEmit', '--pretty', 'false'],
      { cwd: paths.repoRoot },
    )
    let out = ''
    child.stdout.on('data', (c: Buffer) => (out += c.toString()))
    child.stderr.on('data', (c: Buffer) => (out += c.toString()))
    child.on('close', () => resolve(out))
  })
  for (const line of output.split('\n')) {
    const match = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/.exec(line)
    if (!match) continue
    const origin = map.get(path.resolve(paths.repoRoot, match[1]!))
    if (!origin) continue
    problems.push({
      where: `${rel(paths, origin.source)}:${origin.line + Number(match[2])}`,
      message: `Kod bloğu derlenmiyor: ${match[4]} ${match[5]}`,
    })
  }
  await rm(dir, { recursive: true, force: true })
  return map.size
}

/** Diyagram referansları (ders, görev ve çözüm metinleri) ile ortak diyagram klasöründeki SVG'ler. */
async function validateDiagrams(
  paths: RepoPaths,
  curriculum: Curriculum,
  moduleFilter: number | undefined,
  problems: Problem[],
) {
  const diagramsDir = path.join(paths.curriculumRoot, 'diagrams')
  const cssFile = path.join(paths.repoRoot, 'apps', 'platform', 'src', 'styles', 'index.css')
  const known = existsSync(cssFile)
    ? knownDiagramClasses(await readFile(cssFile, 'utf8'))
    : undefined
  const lint = (source: string) => [
    ...(known ? unknownDiagramClasses(source, known) : []),
    ...lintDiagramLayout(source),
  ]
  let count = 0
  const localSvgs = new Set<string>()
  for (const lesson of allLessons(curriculum)) {
    const module = curriculum.modules.find((m) => m.id === lesson.moduleId)!
    if (moduleFilter !== undefined && module.number !== moduleFilter) continue
    const sources = [lesson.markdownPath]
    for (const q of lesson.questions) {
      if (q.promptPath) sources.push(q.promptPath)
      if (q.solutionNotesPath) sources.push(q.solutionNotesPath)
    }
    for (const source of sources) {
      const markdown = await readFile(source, 'utf8')
      // GFM tablolarında kod içindeki kaçışsız | hücreyi böler: `number | null` → `number \\| null`
      markdown.split('\n').forEach((line, index) => {
        if (!line.trimStart().startsWith('|')) return
        if ((line.match(/`[^`]*`/g) ?? []).some((span) => /(?<!\\)\|/.test(span)))
          problems.push({
            where: `${rel(paths, source)}:${index + 1}`,
            message: 'Tablo hücresindeki kodda kaçışsız | var; tablo bozulur. `\\|` yaz.',
          })
      })
      const found = checkDiagrams(markdown, { baseDir: path.dirname(source), diagramsDir })
      count += (markdown.match(/!\[/g) ?? []).length
      for (const problem of found)
        problems.push({ where: `${rel(paths, source)}:${problem.line}`, message: problem.message })
    }
    const lessonDiagrams = path.join(lesson.dir, 'diagrams')
    if (existsSync(lessonDiagrams))
      for (const name of await readdir(lessonDiagrams))
        if (name.endsWith('.svg')) localSvgs.add(path.join(lessonDiagrams, name))
  }
  // Derse özgü diyagramlar: yerleşim sorunu hatadır (taşan metin, çizgi-metin çakışması…)
  for (const file of localSvgs) {
    const layout = lint(await readFile(file, 'utf8'))
    if (layout.length)
      problems.push({
        where: rel(paths, file),
        message: `Diyagram yerleşim sorunları (pnpm preview:diagram ile incele):\n      - ${layout.join('\n      - ')}`,
      })
  }
  if (existsSync(diagramsDir)) {
    for (const name of (await readdir(diagramsDir)).filter((f) => f.endsWith('.svg'))) {
      const file = path.join(diagramsDir, name)
      const source = await readFile(file, 'utf8')
      for (const message of checkSvg(source)) problems.push({ where: rel(paths, file), message })
      const layout = lint(source)
      if (layout.length)
        problems.push({
          where: rel(paths, file),
          message: `Diyagram yerleşim sorunları:\n      - ${layout.join('\n      - ')}`,
        })
    }
  }
  return count
}

/**
 * Ders örneği ≠ görev çözümü (rehber §1.4): ders metnindeki kod, aynı dersin code görevlerinin
 * solution/impl dosyalarında export edilen bir bileşen/fonksiyonu tanımlamamalı.
 */
async function validateLessonSolutionOverlap(
  paths: RepoPaths,
  curriculum: Curriculum,
  moduleFilter: number | undefined,
  problems: Problem[],
) {
  for (const lesson of allLessons(curriculum)) {
    const module = curriculum.modules.find((m) => m.id === lesson.moduleId)!
    if (moduleFilter !== undefined && module.number !== moduleFilter) continue
    const names = new Set<string>()
    for (const q of lesson.questions) {
      if (q.type !== 'code') continue
      const files = [
        ...q.solutionFiles.map((f) => path.join(q.dir, 'solution', f)),
        ...q.implFiles.map((f) => path.join(q.dir, 'impl', f)),
      ].filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))
      for (const file of files)
        for (const [, name] of (await readFile(file, 'utf8')).matchAll(
          /export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class)\s+([A-Za-z_$][\w$]*)/g,
        ))
          names.add(name!)
    }
    if (!names.size) continue
    const markdown = await readFile(lesson.markdownPath, 'utf8')
    const code = [...markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n')
    const clashes = [...names].filter((name) =>
      new RegExp(`(?:function|const|class)\\s+${name}\\b`).test(code),
    )
    if (clashes.length)
      problems.push({
        where: rel(paths, lesson.markdownPath),
        message: `Ders kodu görev çözümündeki adları tanımlıyor: ${clashes.join(', ')}. Derste kavramı başka bir örnekle öğret (rehber §1.4 "Ders örneği ≠ görev çözümü").`,
      })
  }
}

function conceptReport(
  curriculum: Curriculum,
  moduleFilter: number | undefined,
  strict: boolean,
  problems: Problem[],
) {
  const usage = new Map<string, { count: number; modules: Set<string> }>()
  const inModule = new Map<string, number>()
  for (const q of allQuestions(curriculum)) {
    const moduleNumber = curriculum.modules.find((m) => m.id === q.moduleId)?.number
    for (const c of q.meta.concepts) {
      const entry = usage.get(c) ?? { count: 0, modules: new Set<string>() }
      entry.count += 1
      entry.modules.add(q.moduleId)
      usage.set(c, entry)
      if (moduleNumber === moduleFilter) inModule.set(c, (inModule.get(c) ?? 0) + 1)
    }
  }

  // Tek modül doğrulanırken: yalnızca o modülün kavram kullanımı (yazar için geri bildirim)
  if (moduleFilter !== undefined) {
    const list = [...inModule].sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id}×${n}`)
    console.log(pc.dim(`\n  Bu modüldeki kavramlar: ${list.join(', ') || '—'}`))
    return
  }

  const weak: string[] = []
  for (const [id, concept] of Object.entries(curriculum.concepts)) {
    if (!concept.core) continue
    const u = usage.get(id) ?? { count: 0, modules: new Set() }
    if (u.count < 5 || u.modules.size < 2)
      weak.push(`${id} (${u.count} tekrar, ${u.modules.size} modül)`)
  }
  const unused = Object.keys(curriculum.concepts).filter((id) => !usage.has(id))
  if (weak.length) {
    const message = `Tekrar kuralını (≥5 tekrar, ≥2 modül) karşılamayan core kavramlar:\n    ${weak.join('\n    ')}`
    if (strict) problems.push({ where: 'kavramlar', message })
    else console.log(pc.yellow(`\n⚠ ${message}`))
  }
  if (unused.length)
    console.log(pc.dim(`\nℹ Hiç kullanılmayan kavramlar (${unused.length}): ${unused.join(', ')}`))
}

export async function validate(paths: RepoPaths, options: ValidateOptions) {
  const started = performance.now()
  const curriculum = await loadCurriculum(paths.curriculumRoot)
  // Modül filtresi varsa yalnızca o modülün (ve modüller dışı ortak dosyaların) hataları sayılır
  const modulesDir = path.join(paths.curriculumRoot, 'modules') + path.sep
  const filteredModuleDir = curriculum.modules.find((m) => m.number === options.module)?.dir
  const relevantErrors = curriculum.errors.filter((e) => {
    if (options.module === undefined) return true
    if (!e.file.startsWith(modulesDir)) return true
    const prefix = String(options.module).padStart(2, '0') + '-'
    const moduleFolder = e.file.slice(modulesDir.length).split(path.sep)[0] ?? ''
    return filteredModuleDir
      ? e.file.startsWith(filteredModuleDir + path.sep)
      : moduleFolder.startsWith(prefix)
  })
  const problems: Problem[] = relevantErrors.map((e) => ({
    where: rel(paths, e.file),
    message: e.message,
  }))

  const modules = curriculum.modules.filter(
    (m) => options.module === undefined || m.number === options.module,
  )
  const questions = modules.flatMap((m) =>
    m.lessons.flatMap((l) => l.questions.map((q) => ({ q, module: m.number }))),
  )
  console.log(pc.bold(`\nİçerik doğrulama: ${modules.length} modül, ${questions.length} soru`))

  const blocks = await validateCodeBlocks(paths, curriculum, options.module, problems)
  console.log(pc.dim(`  ${blocks} işaretli kod bloğu derlendi`))
  const images = await validateDiagrams(paths, curriculum, options.module, problems)
  await validateLessonSolutionOverlap(paths, curriculum, options.module, problems)
  if (images) console.log(pc.dim(`  ${images} görsel/diyagram referansı denetlendi`))

  if (!options.skipRuns) {
    const runnable = questions.filter(
      ({ q }) =>
        q.type === 'code' ||
        (!options.skipProjects && q.type === 'project' && q.testFiles.length > 0),
    )
    let done = 0
    await pool(runnable, options.concurrency, async ({ q, module }) => {
      if (q.type === 'code') await validateCode(paths, q, problems)
      else await validateProject(paths, q, module, problems)
      done += 1
      process.stdout.write(pc.dim(`\r  ${done}/${runnable.length} görev çalıştırıldı`))
    })
    if (runnable.length) process.stdout.write('\n')
  }

  conceptReport(curriculum, options.module, options.strictConcepts, problems)

  const seconds = ((performance.now() - started) / 1000).toFixed(1)
  if (problems.length === 0) {
    console.log(pc.green(pc.bold(`\n✓ İçerik geçerli (${seconds} sn)\n`)))
    return 0
  }
  console.log(pc.red(pc.bold(`\n✗ ${problems.length} sorun bulundu (${seconds} sn):\n`)))
  for (const p of problems) console.log(`${pc.red('•')} ${pc.bold(p.where)}\n    ${p.message}\n`)
  return 1
}
