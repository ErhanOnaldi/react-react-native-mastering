import { readFileSync } from 'node:fs'
import { isAbsolute, join, sep } from 'node:path'
import { loadConfigFromFile } from 'vite'
import { describe, expect, it } from 'vitest'
import {
  exists,
  inProject,
  playwrightList,
  root,
  tail,
  vitestListFiles,
  vitestRun,
} from './project-tools'

async function loadConfig(file?: string) {
  const loaded = await loadConfigFromFile({ command: 'serve', mode: 'test' }, file, root)
  return loaded?.config
}

describe('Vitest', () => {
  it('test ayarları ayrı vitest.config.ts’te; vite.config.ts’te "test" alanı yok', async () => {
    expect(exists('vitest.config.ts')).toBe(true)
    const vite = await loadConfig()
    expect(vite && 'test' in vite, 'test ayarlarını vitest.config.ts’e taşı').toBe(false)
  })

  it('vitest.config.ts: jsdom ortamı ve en az bir setup dosyası', async () => {
    const config = await loadConfig(inProject('vitest.config.ts'))
    expect(config?.test?.environment).toBe('jsdom')
    const setupFiles = [config?.test?.setupFiles ?? []].flat()
    expect(setupFiles.length).toBeGreaterThan(0)
  })

  it('setup dosyası jest-dom’u yükler, RTL’i temizler ve MSW sunucusunu hata modunda açar', async () => {
    const config = await loadConfig(inProject('vitest.config.ts'))
    const setupSource = [config?.test?.setupFiles ?? []]
      .flat()
      .map((f) => readFileSync(isAbsolute(f) ? f : join(root, f), 'utf8'))
      .join('\n')
    expect(setupSource).toContain('@testing-library/jest-dom/vitest')
    if (config?.test?.globals !== true) expect(setupSource).toMatch(/cleanup\s*\(/)
    expect(setupSource).toMatch(/onUnhandledRequest:\s*['"]error['"]/)
  })

  it('Vitest projedeki testleri bulur ama e2e/ klasöründeki Playwright senaryolarını almaz', async () => {
    const { run, files } = await vitestListFiles()
    expect(files.length, tail(run.output)).toBeGreaterThan(0)
    const e2e = files.filter((f) => f.includes(`${sep}e2e${sep}`))
    expect(e2e, 'vitest.config.ts’te exclude ile e2e/ klasörünü dışarıda bırak').toEqual([])
  }, 60_000)

  it('pnpm test ile projenin kendi testleri çalışır ve geçer', async () => {
    const { run, report } = await vitestRun()
    expect(report, tail(run.output)).not.toBeNull()
    const failed = report!.testResults
      .flatMap((file) => file.assertionResults)
      .filter((t) => t.status === 'failed')
      .map((t) => t.fullName)
    expect(failed).toEqual([])
    expect(report!.numTotalTests).toBeGreaterThan(0)
    expect(report!.success, tail(run.output)).toBe(true)
  }, 150_000)
})

describe('Playwright', () => {
  it('playwright.config.ts yüklenir: testler e2e/ klasöründe, webServer uygulamayı başlatır', async () => {
    const { run, report } = await playwrightList()
    expect(report, tail(run.output)).not.toBeNull()
    expect(report!.errors, tail(run.output)).toEqual([])
    expect(report!.config.projects.length).toBeGreaterThan(0)
    for (const project of report!.config.projects) {
      expect(project.testDir).toBe(inProject('e2e'))
    }
    const server = report!.config.webServer
    expect(server?.command, 'webServer.command tanımlı olmalı').toBeTruthy()
    expect(Boolean(server?.url || server?.port), 'webServer.url ya da port tanımlı olmalı').toBe(
      true,
    )
  }, 60_000)

  it('e2e/ klasöründe en az bir senaryo var', async () => {
    const { specCount } = await playwrightList()
    expect(specCount).toBeGreaterThan(0)
  }, 60_000)
})
