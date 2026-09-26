import { readdirSync, readFileSync } from 'node:fs'
import { relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { inProject, root, tail, vitestRun } from './project-tools'

// Projenin kendi test paketini bir kez çalıştırıp raporu tüm testlerde kullanırız
const suite = vitestRun()

async function testFiles() {
  const { report } = await suite
  return (report?.testResults ?? []).map((file) => ({
    path: relative(root, file.name),
    source: readFileSync(file.name, 'utf8'),
    tests: file.assertionResults.length,
  }))
}

describe('Kitaplık test paketi (pnpm test)', () => {
  it('tüm testler geçer', async () => {
    const { run, report } = await suite
    expect(report, tail(run.output)).not.toBeNull()
    const failed = report!.testResults
      .flatMap((file) => file.assertionResults)
      .filter((t) => t.status === 'failed')
      .map((t) => t.fullName)
    expect(failed).toEqual([])
    expect(report!.success, tail(run.output)).toBe(true)
  }, 150_000)

  it('en az 4 test dosyasında en az 12 test var', async () => {
    const files = await testFiles()
    expect(files.length).toBeGreaterThanOrEqual(4)
    expect(files.reduce((sum, f) => sum + f.tests, 0)).toBeGreaterThanOrEqual(12)
  }, 150_000)

  it('en az 3 dosya ekranı kullanıcı gibi test eder (screen sorguları); projede user-event var', async () => {
    const files = await testFiles()
    const ui = files.filter((f) => /\bscreen\./.test(f.source))
    expect(
      ui.length,
      'screen.getByRole/findByText… kullanan test dosyası sayısı',
    ).toBeGreaterThanOrEqual(3)
    const everything = readdirSync(inProject('src'), { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .map((f) => readFileSync(inProject('src', f), 'utf8'))
    expect(everything.some((text) => text.includes('@testing-library/user-event'))).toBe(true)
  }, 150_000)

  it('en az bir test dosyası saf mantığı (şema, yardımcı fonksiyon) render etmeden test eder', async () => {
    const files = await testFiles()
    const pure = files.filter((f) => !/\bscreen\.|\brender\w*\(/.test(f.source))
    expect(pure.length).toBeGreaterThanOrEqual(1)
  }, 150_000)

  it('en az bir test, Open Library hatasını server.use ile tek teste özel canlandırır', async () => {
    const files = await testFiles()
    expect(files.some((f) => /server\.use\s*\(/.test(f.source))).toBe(true)
  }, 150_000)
})
