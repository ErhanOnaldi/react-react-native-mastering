export type TestStatus = 'passed' | 'failed' | 'skipped'

export interface TestOutcome {
  /** Testin kendi adı */
  name: string
  /** describe başlıklarıyla birlikte tam ad */
  fullName: string
  status: TestStatus
  /** runtime: çalışma zamanı testi · type: tsc ile kontrol edilen tip iddiası */
  failedBy?: 'runtime' | 'type'
  message?: string
  /** `sum.test.ts:6` */
  location?: string
}

export interface TypeDiagnostic {
  /** Öğrenciye gösterilen göreli yol */
  file: string
  line: number
  column: number
  code: string
  message: string
}

export interface MutantOutcome {
  id: string
  label: string
  caught: boolean
}

export type RunStatus = 'passed' | 'failed' | 'error' | 'timeout'

export interface RunResult {
  status: RunStatus
  tests: TestOutcome[]
  typeErrors: TypeDiagnostic[]
  mutants?: MutantOutcome[]
  /** Derleme hatası, çökme vb. durumlarda ham çıktı */
  output?: string
  summary: string
  durationMs: number
}

export function summarize(result: Omit<RunResult, 'summary'>): string {
  if (result.status === 'timeout') {
    return 'Zaman aşımı: sonsuz döngü ya da sonsuz render olabilir.'
  }
  if (result.status === 'error') return 'Testler çalıştırılamadı (derleme ya da import hatası).'
  const counted = result.tests.filter((t) => t.status !== 'skipped')
  const passed = counted.filter((t) => t.status === 'passed').length
  const parts = [`${passed}/${counted.length} test`]
  if (result.typeErrors.length > 0) parts.push(`${result.typeErrors.length} tip hatası`)
  if (result.mutants) {
    const caught = result.mutants.filter((m) => m.caught).length
    parts.push(`${caught}/${result.mutants.length} hatalı versiyon yakalandı`)
  }
  return result.status === 'passed' ? `Tebrikler! ${parts.join(' · ')}` : parts.join(' · ')
}

export function finalize(input: {
  tests: TestOutcome[]
  typeErrors: TypeDiagnostic[]
  mutants?: MutantOutcome[]
  timedOut: boolean
  suiteError?: string
  /** Hata değil ama öğrenciye gösterilecek açıklama (örn. "En az bir test yazmalısın") */
  notice?: string
  durationMs: number
}): RunResult {
  const counted = input.tests.filter((t) => t.status !== 'skipped')
  let status: RunStatus
  if (input.timedOut) status = 'timeout'
  else if (input.suiteError && counted.length === 0) status = 'error'
  else if (
    counted.length > 0 &&
    counted.every((t) => t.status === 'passed') &&
    input.typeErrors.length === 0 &&
    !input.suiteError &&
    (input.mutants ?? []).every((m) => m.caught)
  )
    status = 'passed'
  else status = 'failed'

  const base = {
    status,
    tests: input.tests,
    typeErrors: input.typeErrors,
    ...(input.mutants ? { mutants: input.mutants } : {}),
    ...(input.suiteError || input.notice
      ? { output: [input.suiteError, input.notice].filter(Boolean).join('\n\n') }
      : {}),
    durationMs: input.durationMs,
  }
  return { ...base, summary: summarize(base) }
}
