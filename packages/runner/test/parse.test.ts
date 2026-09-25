import { describe, expect, it } from 'vitest'
import { parseVitestReport } from '../src/parse.ts'
import { finalize } from '../src/result.ts'

const file = (status: string, assertions: { status: string }[], message = '') => ({
  name: '/x/a.test.ts',
  status,
  message,
  assertionResults: assertions.map((a, i) => ({
    ancestorTitles: [],
    fullName: `t${i}`,
    title: `t${i}`,
    status: a.status,
    failureMessages: [],
  })),
})

describe('parseVitestReport', () => {
  it('testler geçse bile dosya düzeyindeki hatayı (afterAll vb.) raporlar', () => {
    const parsed = parseVitestReport({
      testResults: [file('failed', [{ status: 'passed' }], 'afterAll patladı')],
    })
    expect(parsed.suiteError).toContain('afterAll patladı')
    const result = finalize({ ...parsed, typeErrors: [], timedOut: false, durationMs: 1 })
    expect(result.status).toBe('failed')
  })

  it('success=false ve kalan test yoksa yakalanmamış hatayı raporlar', () => {
    const parsed = parseVitestReport({
      success: false,
      testResults: [file('passed', [{ status: 'passed' }])],
    })
    expect(parsed.suiteError).toContain('yakalanmamış')
  })

  it('normal kalan testte ek suite hatası üretmez', () => {
    const parsed = parseVitestReport({
      success: false,
      testResults: [file('failed', [{ status: 'failed' }, { status: 'passed' }])],
    })
    expect(parsed.suiteError).toBeUndefined()
  })
})
