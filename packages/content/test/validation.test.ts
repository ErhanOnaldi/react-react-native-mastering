import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadCurriculum } from '../src/index.ts'

async function makeCurriculum(files: Record<string, string>) {
  const root = await mkdtemp(path.join(tmpdir(), 'rm-content-'))
  for (const [file, content] of Object.entries(files)) {
    const full = path.join(root, file)
    await mkdir(path.dirname(full), { recursive: true })
    await writeFile(full, content)
  }
  return root
}

const concepts = `export default { 'a.b': { title: 'AB' } }`
const moduleTs = `export default { title: 'M', phase: 1, summary: 's', pain: 'p', outcomes: ['o'] }`
const lesson = `---\ntitle: L\nminutes: 3\n---\n# L\n`

describe('içerik doğrulama', () => {
  it('tek cevaplı quizde birden çok doğru şıkkı reddeder', async () => {
    const root = await makeCurriculum({
      'concepts.ts': concepts,
      'modules/01-m/module.ts': moduleTs,
      'modules/01-m/01-l/lesson.md': lesson,
      'modules/01-m/01-l/questions/01-q/question.ts': `export default {
        type: 'quiz', title: 'Q', difficulty: 'kolay', concepts: ['a.b'], question: '?',
        options: [
          { text: 'a', correct: true, explanation: 'x' },
          { text: 'b', correct: true, explanation: 'y' },
        ],
      }`,
    })
    const curriculum = await loadCurriculum(root)
    expect(curriculum.errors).toHaveLength(1)
    expect(curriculum.errors[0]?.message).toContain('tam 1 doğru şık')
  })

  it('tanımsız kavramı ve eksik dosyaları raporlar', async () => {
    const root = await makeCurriculum({
      'concepts.ts': concepts,
      'modules/01-m/module.ts': moduleTs,
      'modules/01-m/01-l/lesson.md': lesson,
      'modules/01-m/01-l/questions/01-q/question.ts': `export default {
        type: 'code', title: 'Q', difficulty: 'kolay', concepts: ['yok.boyle'], files: ['a.ts'],
      }`,
    })
    const messages = (await loadCurriculum(root)).errors.map((e) => e.message)
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Tanımsız kavram: "yok.boyle"'),
        expect.stringContaining('prompt.md zorunlu'),
        expect.stringContaining('starter/a.ts bulunamadı'),
        expect.stringContaining('solution/a.ts bulunamadı'),
        expect.stringContaining('en az bir *.test.ts(x)'),
      ]),
    )
  })

  it('bozuk YAML frontmatter’ı çökmeden hata olarak raporlar', async () => {
    const root = await makeCurriculum({
      'concepts.ts': concepts,
      'modules/01-m/module.ts': moduleTs,
      'modules/01-m/01-l/lesson.md': '---\ntitle: "kapanmamış\nminutes: 3\n---\n# L\n',
      'modules/01-m/02-l/lesson.md': lesson,
    })
    const curriculum = await loadCurriculum(root)
    expect(curriculum.errors.map((e) => e.message)).toEqual([
      expect.stringContaining('Frontmatter okunamadı'),
    ])
    expect(curriculum.modules[0]?.lessons).toHaveLength(1)
  })

  it('hatalı klasör adlarını ve çakışan numaraları raporlar', async () => {
    const root = await makeCurriculum({
      'concepts.ts': concepts,
      'modules/01-m/module.ts': moduleTs,
      'modules/01-x/module.ts': moduleTs,
      'modules/Kotu Ad/module.ts': moduleTs,
    })
    const messages = (await loadCurriculum(root)).errors.map((e) => e.message)
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Aynı numara iki kez'),
        expect.stringContaining('"NN-slug" biçiminde'),
      ]),
    )
  })
})
