// @vitest-environment node
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const project = process.env.RM_PROJECT_DIR ?? ''
const file = (path: string) => join(project, path)
const read = (path: string) => readFileSync(file(path), 'utf8')

describe('Sinema Playwright projesi', () => {
  it('Playwright bağımlılığı ve webServer config dosyası var', () => {
    const pkg = JSON.parse(read('package.json')) as { devDependencies?: Record<string, string> }
    expect(pkg.devDependencies?.['@playwright/test']).toBeTruthy()
    expect(existsSync(file('playwright.config.ts'))).toBe(true)
    const config = read('playwright.config.ts')
    expect(config).toContain('defineConfig')
    expect(config).toMatch(/webServer/)
    expect(config).toMatch(/5174/)
    expect(config).toMatch(/VITE_TMDB_TOKEN/)
    expect(config).toMatch(/reuseExistingServer/)
    expect(read('vite.config.ts')).toMatch(/e2e\/\*\*/)
  })

  it('arama ve giriş akışları ayrı spec dosyalarında page.route kullanır', () => {
    for (const spec of ['e2e/search.spec.ts', 'e2e/auth-watchlist.spec.ts']) {
      expect(existsSync(file(spec)), `${spec} gerekli`).toBe(true)
      expect(read(spec)).toMatch(/page\.route\s*\(/)
      expect(read(spec)).toMatch(/expect\s*\(/)
    }
    expect(read('e2e/search.spec.ts')).toMatch(/themoviedb\.org/)
    expect(read('e2e/auth-watchlist.spec.ts')).toMatch(/dummyjson\.com/)
  })

  it('gerçek Chromium ile iki kritik E2E spec’i geçer', { timeout: 240_000 }, () => {
    expect(existsSync(file('playwright.config.ts'))).toBe(true)
    expect(existsSync(file('e2e/search.spec.ts'))).toBe(true)
    expect(existsSync(file('e2e/auth-watchlist.spec.ts'))).toBe(true)
    const result = spawnSync(
      'npx',
      ['playwright', 'test', 'e2e/search.spec.ts', 'e2e/auth-watchlist.spec.ts', '--reporter=json'],
      {
        cwd: project,
        encoding: 'utf8',
        timeout: 210_000,
        maxBuffer: 4 * 1024 * 1024,
        env: { ...process.env, CI: 'true', VITE_TMDB_TOKEN: 'e2e-sahte-token' },
      },
    )
    expect(result.error, 'Playwright komutu çalışmalı').toBeUndefined()
    expect(result.status, (result.stderr + '\n' + result.stdout).slice(-4000)).toBe(0)
    const report = JSON.parse(result.stdout) as {
      stats?: { expected?: number; unexpected?: number }
    }
    expect(report.stats?.expected, 'En az iki E2E testi koşmalı').toBeGreaterThanOrEqual(2)
    expect(report.stats?.unexpected, 'Hiçbir E2E testi kalmamalı').toBe(0)
  })
})
