import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { QuestionEntry } from '@rm/content'
import {
  applyTypeErrorsToTests,
  parseTscOutput,
  parseVitestReport,
  toDiagnostic,
  type RawTypeDiagnostic,
  type VitestReport,
} from './parse.ts'
import { RUNNER_ROOT, type RepoPaths } from './paths.ts'
import {
  finalize,
  type MutantOutcome,
  type RunResult,
  type TestOutcome,
  type TypeDiagnostic,
} from './result.ts'
import { run, type SpawnResult } from './spawn.ts'
import { ensureWorkspace, restoreReadonlyFiles, workspaceDir } from './workspace.ts'

const EXERCISE_CONFIG = path.join(RUNNER_ROOT, 'vitest', 'exercise.config.ts')
const DEFAULT_CODE_TIMEOUT = 30_000
const DEFAULT_PROJECT_TIMEOUT = 90_000
const TSC_TIMEOUT = 90_000

/** Testlerde kullanılan sahte ortam değişkenleri (gerçek token asla testlere girmez). */
const TEST_ENV = { VITE_TMDB_TOKEN: 'test-token', VITE_APP_TITLE: 'Sinema' }

const bin = (paths: RepoPaths, name: string) =>
  path.join(paths.repoRoot, 'node_modules', '.bin', name)

function runKey(...parts: string[]) {
  return createHash('sha1').update(parts.join('\0')).digest('hex').slice(0, 12)
}

async function prepareRunDir(paths: RepoPaths, key: string) {
  const dir = path.join(paths.cacheDir, 'runs', key)
  await rm(dir, { recursive: true, force: true })
  await mkdir(dir, { recursive: true })
  return dir
}

interface VitestRunInput {
  root: string
  include: string[]
  alias: Record<string, string>
  projectDir?: string
  timeoutMs: number
}

async function runVitest(paths: RepoPaths, runDir: string, name: string, input: VitestRunInput) {
  const outputFile = path.join(runDir, `${name}.json`)
  const config = {
    root: input.root,
    include: input.include,
    alias: { '@test-utils': path.join(paths.testEnvDir, 'index.ts'), ...input.alias },
    setupFiles: [path.join(paths.testEnvDir, 'setup.ts')],
    outputFile,
    cacheDir: path.join(paths.cacheDir, 'vite'),
    env: TEST_ENV,
    projectDir: input.projectDir,
  }
  const spawned = await run(bin(paths, 'vitest'), ['run', '--config', EXERCISE_CONFIG], {
    cwd: paths.repoRoot,
    env: { RM_RUN: JSON.stringify(config) },
    timeoutMs: input.timeoutMs,
  })
  let report: VitestReport | undefined
  if (!spawned.timedOut && existsSync(outputFile)) {
    report = JSON.parse(await readFile(outputFile, 'utf8')) as VitestReport
  }
  return { spawned, report }
}

function vitestOutcome(spawned: SpawnResult, report: VitestReport | undefined) {
  if (report) return parseVitestReport(report)
  return {
    tests: [] as TestOutcome[],
    suiteError: spawned.timedOut
      ? undefined
      : spawned.output.trim().slice(-4000) || 'Vitest çalışamadı.',
  }
}

async function runTsc(
  paths: RepoPaths,
  runDir: string,
  files: string[],
  tsPaths: Record<string, string[]>,
) {
  const tsconfig = path.join(runDir, 'tsconfig.json')
  await writeFile(
    tsconfig,
    JSON.stringify(
      {
        extends: path.join(paths.testEnvDir, 'tsconfig.exercise.json'),
        compilerOptions: {
          paths: { '@test-utils': [path.join(paths.testEnvDir, 'index.ts')], ...tsPaths },
          tsBuildInfoFile: path.join(runDir, 'tsbuildinfo'),
        },
        files: [
          ...files,
          path.join(paths.testEnvDir, 'setup.ts'),
          path.join(paths.testEnvDir, 'env.d.ts'),
        ],
      },
      null,
      2,
    ),
  )
  // --noEmit komut satırında da: config okunamasa bile asla .js üretilmesin
  const spawned = await run(bin(paths, 'tsc'), ['-p', tsconfig, '--noEmit', '--pretty', 'false'], {
    cwd: paths.repoRoot,
    timeoutMs: TSC_TIMEOUT,
  })
  const { diagnostics, global } = parseTscOutput(spawned.output)
  // tsc yolları cwd'ye göre yazar → mutlak yola çevir
  for (const d of diagnostics) d.file = path.resolve(paths.repoRoot, d.file)
  return { diagnostics, global, timedOut: spawned.timedOut }
}

const isTs = (f: string) => /\.(ts|tsx)$/.test(f)

/** Test dosyalarındaki tip hatalarını testlere bağlar, kalanları öğrenciye gösterilecek biçime çevirir. */
async function mergeTypeErrors(
  tests: TestOutcome[],
  diagnostics: RawTypeDiagnostic[],
  testFiles: string[],
  displayRoots: { dir: string; prefix: string }[],
): Promise<TypeDiagnostic[]> {
  const sources = new Map<string, string>()
  for (const file of testFiles) sources.set(file, await readFile(file, 'utf8'))
  const remaining = applyTypeErrorsToTests(tests, diagnostics, sources)
  return remaining.map((d) => {
    const root = displayRoots.find((r) => d.file.startsWith(r.dir + path.sep))
    const diagnostic = toDiagnostic(d, root?.dir ?? path.dirname(d.file))
    if (root?.prefix) diagnostic.file = `${root.prefix}${diagnostic.file}`
    return diagnostic
  })
}

// ---------- code ----------

async function runCode(
  paths: RepoPaths,
  question: QuestionEntry,
  exerciseDir: string,
): Promise<RunResult> {
  if (question.meta.type !== 'code') throw new Error('code sorusu değil')
  const started = performance.now()
  const runDir = await prepareRunDir(paths, runKey(question.id, exerciseDir))
  const testFiles = question.testFiles.map((f) => path.join(question.dir, f))
  const exerciseFiles = question.starterFiles.filter(isTs).map((f) => path.join(exerciseDir, f))

  const [vitest, tsc] = await Promise.all([
    runVitest(paths, runDir, 'vitest', {
      root: question.dir,
      include: question.testFiles,
      alias: { '@exercise': exerciseDir },
      timeoutMs: question.meta.timeoutMs ?? DEFAULT_CODE_TIMEOUT,
    }),
    runTsc(paths, runDir, [...exerciseFiles, ...testFiles], {
      '@exercise/*': [`${exerciseDir}/*`],
    }),
  ])

  const outcome = vitestOutcome(vitest.spawned, vitest.report)
  const { tests } = outcome
  const suiteError = [outcome.suiteError, ...tsc.global].filter(Boolean).join('\n') || undefined
  const typeErrors = await mergeTypeErrors(tests, tsc.diagnostics, testFiles, [
    { dir: exerciseDir, prefix: '' },
    { dir: question.dir, prefix: '' },
  ])
  return finalize({
    tests,
    typeErrors,
    timedOut: vitest.spawned.timedOut,
    suiteError,
    durationMs: Math.round(performance.now() - started),
  })
}

// ---------- test yazma (mutation testing) ----------

async function runTestWriting(
  paths: RepoPaths,
  question: QuestionEntry,
  testsDir: string,
): Promise<RunResult> {
  if (question.meta.type !== 'code' || !question.meta.testWriting)
    throw new Error('test yazma sorusu değil')
  const started = performance.now()
  const runDir = await prepareRunDir(paths, runKey(question.id, testsDir, 'mutation'))
  const implDir = path.join(question.dir, 'impl')
  const userTests = question.meta.files.filter((f) => /\.test\.tsx?$/.test(f))
  const timeoutMs = question.meta.timeoutMs ?? DEFAULT_CODE_TIMEOUT

  // Her mutant = impl + mutant'ın değiştirdiği dosyalar
  const mutantDirs = await Promise.all(
    question.meta.testWriting.mutants.map(async (m) => {
      const dir = path.join(runDir, 'mutants', m.id)
      await cp(implDir, dir, { recursive: true })
      await cp(path.join(question.dir, 'mutants', m.id), dir, { recursive: true, force: true })
      return { ...m, dir }
    }),
  )

  const vitestInput = (alias: string) => ({
    root: testsDir,
    include: userTests,
    alias: { '@impl': alias },
    timeoutMs,
  })

  const [impl, tsc, ...mutantRuns] = await Promise.all([
    runVitest(paths, runDir, 'impl', vitestInput(implDir)),
    runTsc(
      paths,
      runDir,
      userTests.map((f) => path.join(testsDir, f)),
      { '@impl/*': [`${implDir}/*`] },
    ),
    ...mutantDirs.map((m) => runVitest(paths, runDir, `mutant-${m.id}`, vitestInput(m.dir))),
  ])

  const { tests, suiteError } = vitestOutcome(impl.spawned, impl.report)
  const realTests = tests.filter((t) => t.status !== 'skipped')
  const mutants: MutantOutcome[] = mutantDirs.map((m, i) => {
    const outcome = vitestOutcome(mutantRuns[i]!.spawned, mutantRuns[i]!.report)
    const caught =
      realTests.length > 0 &&
      (outcome.tests.some((t) => t.status === 'failed') || Boolean(outcome.suiteError))
    return { id: m.id, label: m.label, caught }
  })

  const typeErrors = await mergeTypeErrors(
    tests,
    tsc.diagnostics,
    userTests.map((f) => path.join(testsDir, f)),
    [{ dir: testsDir, prefix: '' }],
  )
  return finalize({
    tests,
    typeErrors,
    mutants,
    timedOut: impl.spawned.timedOut,
    suiteError,
    notice:
      realTests.length === 0 && !suiteError
        ? 'En az bir test yazmalısın (it.todo sayılmaz).'
        : undefined,
    durationMs: Math.round(performance.now() - started),
  })
}

// ---------- project ----------

async function runProject(
  paths: RepoPaths,
  question: QuestionEntry,
  projectDir: string,
): Promise<RunResult> {
  if (question.meta.type !== 'project') throw new Error('project sorusu değil')
  const started = performance.now()
  const runDir = await prepareRunDir(paths, runKey(question.id, projectDir))
  const testsRoot = path.join(question.dir, 'tests')
  const timeoutMs = question.meta.timeoutMs ?? DEFAULT_PROJECT_TIMEOUT

  const hasTsconfig = existsSync(path.join(projectDir, 'tsconfig.json'))
  const [vitest, tsc] = await Promise.all([
    runVitest(paths, runDir, 'vitest', {
      root: testsRoot,
      include: question.testFiles,
      alias: { '@project': projectDir },
      projectDir: existsSync(path.join(projectDir, 'vite.config.ts')) ? projectDir : undefined,
      timeoutMs,
    }),
    // Projenin kendi tip kontrolü (öğrencinin `pnpm build` ile çalıştırdığı `tsc -b` ile aynı)
    hasTsconfig
      ? run(bin(paths, 'tsc'), ['-b', '--pretty', 'false'], {
          cwd: projectDir,
          timeoutMs: TSC_TIMEOUT,
        })
      : Promise.resolve(undefined),
  ])

  const { tests, suiteError } = vitestOutcome(vitest.spawned, vitest.report)
  const typeErrors: TypeDiagnostic[] = tsc
    ? parseTscOutput(tsc.output).diagnostics.map((d) =>
        toDiagnostic({ ...d, file: path.resolve(projectDir, d.file) }, projectDir),
      )
    : []
  return finalize({
    tests,
    typeErrors,
    timedOut: vitest.spawned.timedOut,
    suiteError,
    durationMs: Math.round(performance.now() - started),
  })
}

// ---------- genel giriş noktası ----------

export interface RunOptions {
  /**
   * Hedef klasör. Verilmezse öğrencinin çalışması kullanılır:
   * code → workspace/<soru>, test yazma → workspace/<soru>, project → projects/<proje>
   */
  target?: string
}

export async function runQuestion(
  paths: RepoPaths,
  question: QuestionEntry,
  options: RunOptions = {},
): Promise<RunResult> {
  const meta = question.meta
  if (meta.type === 'quiz') throw new Error('Quiz soruları runner ile çalıştırılmaz.')

  if (meta.type === 'project') {
    if (question.testFiles.length === 0) {
      throw new Error('Bu görevin testi yok; değerlendirme listesiyle tamamlanır.')
    }
    return runProject(
      paths,
      question,
      options.target ?? path.join(paths.projectsRoot, meta.project),
    )
  }

  if (!options.target) {
    await ensureWorkspace(paths, question)
    await restoreReadonlyFiles(paths, question)
  }
  const target = options.target ?? workspaceDir(paths, question)
  return meta.testWriting
    ? runTestWriting(paths, question, target)
    : runCode(paths, question, target)
}
