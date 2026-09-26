// Kurulum testlerinin ortak yardımcıları: projenin dosyalarını okur, araçlarını (Vitest, Playwright)
// ayrı bir süreçte gerçekten çalıştırır. Proje kökü: process.env.RM_PROJECT_DIR
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

export const root = process.env.RM_PROJECT_DIR!

export const inProject = (...parts: string[]) => join(root, ...parts)
export const read = (...parts: string[]) => readFileSync(inProject(...parts), 'utf8')
export const exists = (...parts: string[]) => existsSync(inProject(...parts))

export interface PackageJson {
  type?: string
  private?: boolean
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export function readPackageJson(): PackageJson {
  return JSON.parse(read('package.json')) as PackageJson
}

/** İlk bulunan dosyanın yolu (örn. eslint.config.js | .mjs | .ts) */
export function firstExisting(names: string[]) {
  return names.map((name) => inProject(name)).find((file) => existsSync(file))
}

const require = createRequire(import.meta.url)
const packageBin = (pkg: string, bin: string) =>
  join(dirname(require.resolve(`${pkg}/package.json`)), bin)

/** Alt süreç, platformun test ortamını miras almasın: projen kendi ayarlarıyla çalışır. */
function cleanEnv() {
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (value === undefined) continue
    if (key.startsWith('VITEST') || key.startsWith('VITE_')) continue
    if (['RM_PROJECT_DIR', 'NODE_ENV', 'TEST', 'MODE'].includes(key)) continue
    env[key] = value
  }
  return { ...env, CI: '1', FORCE_COLOR: '0', NO_COLOR: '1' }
}

export interface ToolRun {
  code: number | null
  output: string
}

function runNode(script: string, args: string[], timeoutMs: number): Promise<ToolRun> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], { cwd: root, env: cleanEnv() })
    let output = ''
    child.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()))
    child.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()))
    const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs)
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, output })
    })
  })
}

/** Geçici bir klasörde JSON rapor üretip okur */
async function withJsonReport<T>(
  run: (file: string) => Promise<ToolRun>,
): Promise<{ run: ToolRun; report: T | null }> {
  const dir = mkdtempSync(join(tmpdir(), 'kitaplik-'))
  const file = join(dir, 'report.json')
  try {
    const result = await run(file)
    const report = existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : null
    return { run: result, report }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

/** `vitest list --filesOnly`: Vitest'in bulduğu test dosyaları */
export async function vitestListFiles() {
  const vitest = packageBin('vitest', 'vitest.mjs')
  const { run, report } = await withJsonReport<{ file: string }[]>((file) =>
    runNode(vitest, ['list', '--filesOnly', `--json=${file}`], 60_000),
  )
  return { run, files: (report ?? []).map((entry) => entry.file) }
}

interface VitestReport {
  success: boolean
  numTotalTests: number
  numFailedTests: number
  testResults: { name: string; assertionResults: { fullName: string; status: string }[] }[]
}

/** Projenin kendi test paketini `vitest run` ile çalıştırır */
export async function vitestRun() {
  const vitest = packageBin('vitest', 'vitest.mjs')
  return withJsonReport<VitestReport>((file) =>
    runNode(vitest, ['run', '--reporter=json', `--outputFile=${file}`], 150_000),
  )
}

interface PlaywrightSuite {
  specs?: { title: string }[]
  suites?: PlaywrightSuite[]
}
interface PlaywrightListReport {
  config: {
    webServer: { command?: string; url?: string; port?: number } | null
    projects: { name: string; testDir: string }[]
  }
  suites: PlaywrightSuite[]
  errors: { message: string }[]
}

/** `playwright test --list`: tarayıcı açmadan config'i yükler ve senaryoları listeler */
export async function playwrightList() {
  const cli = packageBin('@playwright/test', 'cli.js')
  const result = await runNode(cli, ['test', '--list', '--reporter=json'], 60_000)
  let report: PlaywrightListReport | null = null
  try {
    report = JSON.parse(result.output.slice(result.output.indexOf('{'))) as PlaywrightListReport
  } catch {
    report = null
  }
  const count = (suite: PlaywrightSuite): number =>
    (suite.specs?.length ?? 0) + (suite.suites ?? []).reduce((sum, s) => sum + count(s), 0)
  const specCount = (report?.suites ?? []).reduce((sum, s) => sum + count(s), 0)
  return { run: result, report, specCount }
}

/** Hata mesajı için çıktının son satırları */
export const tail = (text: string, lines = 25) => text.trim().split('\n').slice(-lines).join('\n')
