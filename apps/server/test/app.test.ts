import { mkdir, mkdtemp } from 'node:fs/promises'
import path from 'node:path'
import { DEFAULT_REPO_ROOT, readProgress, resolvePaths, type RepoPaths } from '@rm/runner'
import { beforeAll, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.ts'
import type {
  AnswerResultDto,
  CodeQuestionDto,
  CurriculumDto,
  HintsDto,
  LessonDto,
  ProjectQuestionDto,
  QuizQuestionDto,
  ReviewPromptDto,
  RunResponseDto,
  SolutionDto,
} from '../src/dto.ts'
import { EventHub, WriteTracker } from '../src/events.ts'
import { CurriculumStore } from '../src/store.ts'

let app: ReturnType<typeof createApp>
let paths: RepoPaths

beforeAll(async () => {
  const tmpRoot = path.join(DEFAULT_REPO_ROOT, '.cache', 'test-tmp')
  await mkdir(tmpRoot, { recursive: true })
  const tmp = await mkdtemp(path.join(tmpRoot, 'server-'))
  const fixtures = path.join(DEFAULT_REPO_ROOT, 'fixtures')
  paths = resolvePaths(DEFAULT_REPO_ROOT, {
    curriculumRoot: path.join(fixtures, 'mini-curriculum'),
    workspaceRoot: path.join(tmp, 'workspace'),
    projectsRoot: path.join(fixtures, 'projects'),
    cacheDir: path.join(tmp, 'cache'),
    progressFile: path.join(tmp, 'progress.json'),
  })
  app = createApp({
    paths,
    store: new CurriculumStore(paths.curriculumRoot),
    hub: new EventHub(),
    tracker: new WriteTracker(),
    hasTmdbToken: () => true,
  })
})

async function call<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<{ status: number; data: T }> {
  const response = await app.request(url, {
    method,
    headers: { host: 'localhost:5173', 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return { status: response.status, data: (await response.json()) as T }
}

describe('müfredat', () => {
  it('modül ağacını ve ortam bilgisini döner', async () => {
    const { data } = await call<CurriculumDto>('GET', '/api/curriculum')
    expect(data.errors).toEqual([])
    expect(data.env.tmdbToken).toBe(true)
    expect(data.modules[0]?.lessons[0]?.questions).toHaveLength(10)
    expect(data.modules[0]?.lessons[0]?.questions[0]).toMatchObject({
      code: '0.1.1',
      type: 'quiz',
      status: 'not-started',
    })
  })

  it('ders metnini HTML olarak döner', async () => {
    const { data } = await call<LessonDto>('GET', '/api/lessons/0.1')
    expect(data.title).toBe('İlk ders')
    expect(data.html).toContain('data-kind="tip"')
    expect(data.module.code).toBe('0')
  })

  it('yerel olmayan Host başlığını reddeder', async () => {
    const response = await app.request('/api/curriculum', { headers: { host: 'evil.example.com' } })
    expect(response.status).toBe(403)
  })
})

describe('quiz', () => {
  it('doğru cevabı sızdırmaz, cevaplayınca açıklamaları verir', async () => {
    const { data: q } = await call<QuizQuestionDto>('GET', '/api/questions/0.1.1')
    expect(q.type).toBe('quiz')
    expect(JSON.stringify(q)).not.toContain('correct')
    expect(q.next?.code).toBe('0.1.2')

    const wrong = await call<AnswerResultDto>('POST', '/api/questions/0.1.1/answer', {
      selected: [1],
    })
    expect(wrong.data.correct).toBe(false)
    expect(wrong.data.progress.status).toBe('in-progress')

    const right = await call<AnswerResultDto>('POST', '/api/questions/0.1.1/answer', {
      selected: [0],
    })
    expect(right.data.correct).toBe(true)
    expect(right.data.options[1]?.explanationHtml).toContain('string birleştirme')
    expect(right.data.progress).toMatchObject({ status: 'passed', attempts: 2 })
  })

  it('çok cevaplı soruda tüm doğru şıkları ister', async () => {
    const partial = await call<AnswerResultDto>('POST', '/api/questions/0.1.2/answer', {
      selected: [0],
    })
    expect(partial.data.correct).toBe(false)
    const full = await call<AnswerResultDto>('POST', '/api/questions/0.1.2/answer', {
      selected: [0, 2],
    })
    expect(full.data.correct).toBe(true)
  })

  it('geçersiz gövdeyi 400 ile reddeder', async () => {
    const { status } = await call('POST', '/api/questions/0.1.1/answer', { selected: [] })
    expect(status).toBe(400)
  })
})

describe('kod görevi akışı', () => {
  it('dosyaları getirir, kaydeder, çalıştırır ve ilerlemeyi işler', async () => {
    const { data: q } = await call<CodeQuestionDto>('GET', '/api/questions/0.1.3')
    expect(q.files.map((f) => [f.name, f.editable, f.kind])).toEqual([
      ['sum.ts', true, 'code'],
      ['sum.test.ts', false, 'test'],
    ])
    expect(q.hintCount).toBe(1)

    const failing = await call<RunResponseDto>('POST', '/api/questions/0.1.3/run')
    expect(failing.data.result.status).toBe('failed')

    const saved = await call('PUT', '/api/questions/0.1.3/files', {
      name: 'sum.ts',
      content: 'export function sum(a: number, b: number): number {\n  return a + b\n}\n',
    })
    expect(saved.status).toBe(200)

    const passing = await call<RunResponseDto>('POST', '/api/questions/0.1.3/run')
    expect(passing.data.result.status).toBe('passed')
    expect(passing.data.progress.status).toBe('passed')
    expect(passing.data.next?.code).toBe('0.1.4')

    const again = await call<CodeQuestionDto>('GET', '/api/questions/0.1.3')
    expect(again.data.lastResult?.status).toBe('passed')
  })

  it('salt okunur dosyaya yazmayı reddeder', async () => {
    const { status } = await call('PUT', '/api/questions/0.1.6/files', {
      name: 'Preview.tsx',
      content: 'x',
    })
    expect(status).toBe(400)
  })

  it('ipuçlarını kademeli açar ve sayısını kaydeder', async () => {
    const none = await call<HintsDto>('GET', '/api/questions/0.1.3/hints?count=0')
    expect(none.data).toEqual({ hints: [], total: 1 })
    const one = await call<HintsDto>('GET', '/api/questions/0.1.3/hints?count=5')
    expect(one.data.hints).toHaveLength(1)
    expect(
      (await readProgress(paths.progressFile)).questions['00-deneme/01-ilk-ders/03-toplama']
        ?.hintsUsed,
    ).toBe(1)
  })

  it('çözümü ve notlarını verir, erken bakışı işaretler', async () => {
    const { data } = await call<SolutionDto>('GET', '/api/questions/0.1.4/solution')
    expect(data.files[0]?.content).toContain("Omit<T, 'id'>")
    const progress = await readProgress(paths.progressFile)
    expect(progress.questions['00-deneme/01-ilk-ders/04-tip']?.solutionViewed).toBe(true)
  })

  it('sıfırlayınca başlangıç koduna döner', async () => {
    await call('PUT', '/api/questions/0.1.3/files', { name: 'sum.ts', content: '// değişti' })
    const { data } = await call<{ files: CodeQuestionDto['files'] }>(
      'POST',
      '/api/questions/0.1.3/reset',
    )
    expect(data.files[0]?.content).toContain('return 0')
  })

  it('review prompt üretir', async () => {
    const { data } = await call<ReviewPromptDto>('GET', '/api/questions/0.1.3/review-prompt')
    expect(data.prompt).toContain('### sum.ts')
    expect(data.prompt).toContain('Fonksiyon saf mı?')
    expect(data.warn).toBe(false)
  })
})

describe('proje görevleri', () => {
  it('VS Code bilgilerini ve komutu verir', async () => {
    const { data } = await call<ProjectQuestionDto>('GET', '/api/questions/0.1.8')
    expect(data.command).toBe('pnpm check 0.1.8')
    expect(data.focusFiles[0]?.absolutePath).toBe(
      path.join(paths.projectsRoot, 'mini', 'src/greet.ts'),
    )
    expect(data.hasTests).toBe(true)
  })

  it('testsiz görev elle tamamlanır', async () => {
    const run = await call('POST', '/api/questions/0.1.9/run')
    expect(run.status).toBe(400)
    const done = await call<{ progress: { status: string } }>('POST', '/api/questions/0.1.9/done', {
      done: true,
    })
    expect(done.data.progress.status).toBe('passed')
  })
})
