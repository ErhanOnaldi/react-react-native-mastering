import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { findQuestion, loadCurriculum, type Curriculum, type QuestionEntry } from '@rm/content'
import { beforeAll, describe, expect, it } from 'vitest'
import {
  DEFAULT_REPO_ROOT,
  ensureWorkspace,
  resolvePaths,
  runQuestion,
  workspaceDir,
  writeWorkspaceFile,
  type RepoPaths,
} from '../src/index.ts'

const fixtures = path.join(DEFAULT_REPO_ROOT, 'fixtures')
// Gerçek kullanımdaki gibi repo içinde: bağımlılıklar kök node_modules'tan çözülür.
const tmpRoot = path.join(DEFAULT_REPO_ROOT, '.cache', 'test-tmp')
const makeTmp = async (prefix: string) => {
  await mkdir(tmpRoot, { recursive: true })
  return mkdtemp(path.join(tmpRoot, prefix))
}
let curriculum: Curriculum
let paths: RepoPaths

beforeAll(async () => {
  const tmp = await makeTmp('runner-')
  paths = resolvePaths(DEFAULT_REPO_ROOT, {
    curriculumRoot: path.join(fixtures, 'mini-curriculum'),
    workspaceRoot: path.join(tmp, 'workspace'),
    projectsRoot: path.join(fixtures, 'projects'),
    cacheDir: path.join(tmp, 'cache'),
    progressFile: path.join(tmp, 'progress.json'),
  })
  curriculum = await loadCurriculum(paths.curriculumRoot)
  expect(curriculum.errors).toEqual([])
})

function q(code: string): QuestionEntry {
  const question = findQuestion(curriculum, code)
  if (!question) throw new Error(`soru yok: ${code}`)
  return question
}

/** starter + solution birleşimi (doğrulama hattının yaptığı gibi) */
async function solutionDir(question: QuestionEntry) {
  const dir = await makeTmp('solution-')
  await cp(path.join(question.dir, 'starter'), dir, { recursive: true })
  await cp(path.join(question.dir, 'solution'), dir, { recursive: true, force: true })
  return dir
}

const starter = (question: QuestionEntry) => path.join(question.dir, 'starter')

describe.concurrent('code görevleri', () => {
  it('başlangıç kodu kalır, çözüm geçer', async () => {
    const question = q('0.1.3')
    const failing = await runQuestion(paths, question, { target: starter(question) })
    expect(failing.status).toBe('failed')
    expect(failing.tests.map((t) => t.status)).toEqual(['failed', 'failed'])
    expect(failing.tests[0]?.message).toContain('expected +0 to be 3')
    expect(failing.tests[0]?.location).toBe('sum.test.ts:6')
    expect(failing.summary).toBe('0/2 test')

    const passing = await runQuestion(paths, question, { target: await solutionDir(question) })
    expect(passing.status).toBe('passed')
    expect(passing.summary).toContain('2/2 test')
  })

  it('tip iddialarını (expectTypeOf) ilgili teste bağlar', async () => {
    const question = q('0.1.4')
    const failing = await runQuestion(paths, question, { target: starter(question) })
    expect(failing.status).toBe('failed')
    const byName = Object.fromEntries(failing.tests.map((t) => [t.name, t]))
    expect(byName['id alanını çıkarır']?.status).toBe('failed')
    expect(byName['id alanını çıkarır']?.failedBy).toBe('type')
    expect(byName['diğer alanlara dokunmaz']?.status).toBe('passed')
    expect(failing.typeErrors).toEqual([])

    const passing = await runQuestion(paths, question, { target: await solutionDir(question) })
    expect(passing.status).toBe('passed')
  })

  it('React bileşenini RTL ile test eder', async () => {
    const question = q('0.1.6')
    expect((await runQuestion(paths, question, { target: starter(question) })).status).toBe('failed')
    const passing = await runQuestion(paths, question, { target: await solutionDir(question) })
    expect(passing.status, JSON.stringify(passing, null, 2)).toBe('passed')
  })

  it('MSW + fetch + AbortController ile istek sayısını ölçer', async () => {
    const question = q('0.1.7')
    const failing = await runQuestion(paths, question, { target: starter(question) })
    const once = failing.tests.find((t) => t.name === 'yalnızca bir istek atar')
    expect(once?.status).toBe('failed')
    expect(once?.message).toContain('Beklenen: 1 istek')

    const passing = await runQuestion(paths, question, { target: await solutionDir(question) })
    expect(passing.status, JSON.stringify(passing, null, 2)).toBe('passed')
  })

  it('sonsuz döngüde zaman aşımına uğrar', async () => {
    const question = q('0.1.10')
    const result = await runQuestion(paths, question, { target: starter(question) })
    expect(result.status).toBe('timeout')
    expect(result.summary).toContain('sonsuz döngü')
  })

  it('tip hatalarını öğrenci dosyası yoluyla raporlar', async () => {
    const question = q('0.1.3')
    const dir = await solutionDir(question)
    await writeFile(path.join(dir, 'sum.ts'), 'export function sum(a: number, b: number): number {\n  return `${a}${b}`\n}\n')
    const result = await runQuestion(paths, question, { target: dir })
    expect(result.status).toBe('failed')
    expect(result.typeErrors[0]).toMatchObject({ file: 'sum.ts', line: 2, code: 'TS2322' })
  })
})

describe.concurrent('test yazma görevleri (mutation testing)', () => {
  it('boş test dosyası kalır', async () => {
    const question = q('0.1.5')
    const result = await runQuestion(paths, question, { target: starter(question) })
    expect(result.status).toBe('failed')
    expect(result.output).toContain('En az bir test')
    expect(result.mutants?.every((m) => !m.caught)).toBe(true)
  })

  it('referans testler impl üzerinde geçer ve tüm mutant\'ları yakalar', async () => {
    const question = q('0.1.5')
    const result = await runQuestion(paths, question, { target: path.join(question.dir, 'solution') })
    expect(result.status, JSON.stringify(result, null, 2)).toBe('passed')
    expect(result.mutants).toEqual([
      { id: 'ignores-b', label: 'ikinci sayıyı yok sayan versiyon', caught: true },
      { id: 'always-zero', label: 'her zaman 0 döndüren versiyon', caught: true },
    ])
  })
})

describe.concurrent('project görevleri', () => {
  it('öğrencinin projesine karşı kalır, checkpoint\'e karşı geçer', async () => {
    const question = q('0.1.8')
    const failing = await runQuestion(paths, question)
    expect(failing.status).toBe('failed')
    const passing = await runQuestion(paths, question, {
      target: path.join(paths.curriculumRoot, 'checkpoints', 'mini', '00'),
    })
    expect(passing.status, JSON.stringify(passing, null, 2)).toBe('passed')
  })
})

describe('workspace akışı', () => {
  it('başlangıç kodunu kopyalar, kaydedilen dosyayla çalışır', async () => {
    const question = q('0.1.3')
    await ensureWorkspace(paths, question)
    const dir = workspaceDir(paths, question)
    expect(await readFile(path.join(dir, 'sum.ts'), 'utf8')).toContain('return 0')

    await writeWorkspaceFile(paths, question, 'sum.ts', 'export function sum(a: number, b: number): number {\n  return a + b\n}\n')
    const result = await runQuestion(paths, question)
    expect(result.status).toBe('passed')
  })

  it('düzenlenemeyen dosyaya yazmayı reddeder', async () => {
    const question = q('0.1.6')
    await expect(writeWorkspaceFile(paths, question, 'Preview.tsx', 'x')).rejects.toThrow('düzenlenemez')
    await expect(writeWorkspaceFile(paths, question, '../../x.ts', 'x')).rejects.toThrow()
  })
})
