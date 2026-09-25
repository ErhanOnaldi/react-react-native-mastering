import { mkdir, mkdtemp } from 'node:fs/promises'
import path from 'node:path'
import { findQuestion, loadCurriculum } from '@rm/content'
import { describe, expect, it } from 'vitest'
import {
  buildReviewPrompt,
  collectReviewFiles,
  DEFAULT_REPO_ROOT,
  markDone,
  readProgress,
  recordAttempt,
  recordHint,
  recordSolutionView,
  resolvePaths,
} from '../src/index.ts'

async function tmp() {
  const root = path.join(DEFAULT_REPO_ROOT, '.cache', 'test-tmp')
  await mkdir(root, { recursive: true })
  return mkdtemp(path.join(root, 'progress-'))
}

describe('ilerleme', () => {
  it('denemeleri, ipuçlarını ve çözüm görüntülemeyi kaydeder', async () => {
    const file = path.join(await tmp(), 'progress.json')
    await recordHint(file, 'a', 1)
    await recordSolutionView(file, 'a')
    await recordAttempt(file, 'a', false)
    let p = await readProgress(file)
    expect(p.questions.a).toMatchObject({ status: 'in-progress', attempts: 1, hintsUsed: 1, solutionViewed: true })

    await recordAttempt(file, 'a', true)
    await recordAttempt(file, 'a', false) // geçtikten sonraki başarısız deneme durumu bozmaz
    p = await readProgress(file)
    expect(p.questions.a?.status).toBe('passed')
    expect(p.questions.a?.firstPassedAt).toBeDefined()
  })

  it('geçildikten sonra çözüme bakmak kopya sayılmaz', async () => {
    const file = path.join(await tmp(), 'progress.json')
    await recordAttempt(file, 'b', true)
    await recordSolutionView(file, 'b')
    expect((await readProgress(file)).questions.b?.solutionViewed).toBe(false)
  })

  it('eşzamanlı güncellemeleri kaybetmez', async () => {
    const file = path.join(await tmp(), 'progress.json')
    await Promise.all(Array.from({ length: 20 }, (_, i) => recordAttempt(file, `q${i}`, true)))
    expect(Object.keys((await readProgress(file)).questions)).toHaveLength(20)
  })

  it('rubric görevini tamamlandı/tamamlanmadı olarak işaretler', async () => {
    const file = path.join(await tmp(), 'progress.json')
    await markDone(file, 'c', true)
    expect((await readProgress(file)).questions.c?.status).toBe('passed')
    await markDone(file, 'c', false)
    expect((await readProgress(file)).questions.c?.status).toBe('in-progress')
  })
})

describe('review prompt', () => {
  it('görevi, kriterleri, dosyaları ve sonuçları içerir', async () => {
    const fixtures = path.join(DEFAULT_REPO_ROOT, 'fixtures')
    const paths = resolvePaths(DEFAULT_REPO_ROOT, {
      curriculumRoot: path.join(fixtures, 'mini-curriculum'),
      projectsRoot: path.join(fixtures, 'projects'),
    })
    const curriculum = await loadCurriculum(paths.curriculumRoot)
    const question = findQuestion(curriculum, '0.1.8')!
    const files = await collectReviewFiles(paths, question)
    expect(files.map((f) => f.path)).toEqual(['src/greet.ts'])

    const prompt = buildReviewPrompt({
      question,
      task: 'greet fonksiyonunu tamamla.',
      files,
      lastResult: {
        status: 'failed',
        summary: '0/1 test',
        tests: [{ name: 'ismi selamlar', fullName: 'ismi selamlar', status: 'failed' }],
        typeErrors: [],
        durationMs: 1,
      },
    })
    expect(prompt).toContain('## Görev (0.1.8 · greet fonksiyonu)')
    expect(prompt).toContain('1. Fonksiyon isimlendirmesi açık mı?')
    expect(prompt).toContain('### src/greet.ts\n\n```ts\nexport function greet')
    expect(prompt).toContain('❌ ismi selamlar')
    expect(prompt).toContain('Tam çözümü yazma')
  })
})
