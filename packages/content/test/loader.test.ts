import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { allQuestions, findQuestion, loadCurriculum, nextQuestion } from '../src/index.ts'

const root = path.resolve(import.meta.dirname, '../../../fixtures/mini-curriculum')

describe('loadCurriculum', () => {
  it('fixture müfredatı hatasız yükler', async () => {
    const curriculum = await loadCurriculum(root)
    expect(curriculum.errors).toEqual([])
    expect(curriculum.modules).toHaveLength(1)
    expect(curriculum.modules[0]?.lessons[0]?.questions).toHaveLength(10)
  })

  it('kısa kodları dizin öneklerinden türetir', async () => {
    const curriculum = await loadCurriculum(root)
    const q = findQuestion(curriculum, '0.1.3')
    expect(q?.id).toBe('00-deneme/01-ilk-ders/03-toplama')
    expect(q?.type).toBe('code')
    expect(q?.starterFiles).toEqual(['sum.ts'])
    expect(q?.testFiles).toEqual(['sum.test.ts'])
  })

  it('project görevlerinde tests/ klasörünü okur', async () => {
    const curriculum = await loadCurriculum(root)
    expect(findQuestion(curriculum, '0.1.8')?.testFiles).toEqual(['greet.test.ts'])
  })

  it('şema varsayılanlarını uygular', async () => {
    const curriculum = await loadCurriculum(root)
    const quiz = findQuestion(curriculum, '0.1.1')
    expect(quiz?.meta.type === 'quiz' && quiz.meta.mode).toBe('single')
    expect(curriculum.modules[0]?.lessons[0]?.frontmatter.kind).toBe('concept')
  })

  it('önerilen sırada sonraki soruyu bulur', async () => {
    const curriculum = await loadCurriculum(root)
    const ids = allQuestions(curriculum).map((q) => q.code)
    expect(ids.slice(0, 3)).toEqual(['0.1.1', '0.1.2', '0.1.3'])
    expect(nextQuestion(curriculum, '00-deneme/01-ilk-ders/01-tekli')?.code).toBe('0.1.2')
  })
})
