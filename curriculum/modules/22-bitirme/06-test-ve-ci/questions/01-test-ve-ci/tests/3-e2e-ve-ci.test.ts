import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as prettier from 'prettier'
import { describe, expect, it } from 'vitest'
import { exists, inProject, playwrightList, tail } from './project-tools'

function e2eSources() {
  return readdirSync(inProject('e2e'), { recursive: true, encoding: 'utf8' })
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .map((f) => readFileSync(join(inProject('e2e'), f), 'utf8'))
    .join('\n')
}

function workflows() {
  const dir = inProject('.github', 'workflows')
  if (!exists('.github', 'workflows')) return []
  return readdirSync(dir)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => ({ name: f, text: readFileSync(join(dir, f), 'utf8') }))
}

describe('Playwright senaryoları', () => {
  it('e2e/ klasöründe en az 2 senaryo var (duman testi + bir kullanıcı akışı)', async () => {
    const { run, specCount } = await playwrightList()
    expect(specCount, tail(run.output)).toBeGreaterThanOrEqual(2)
  }, 60_000)

  it('E2E testleri gerçek Open Library’ye gitmez: page.route ile ağ taklit edilir', () => {
    const source = e2eSources()
    expect(source).toMatch(/\.route\s*\(/)
    expect(source).toMatch(/openlibrary\.org/)
  })
})

describe('GitHub Actions (CI)', () => {
  it('.github/workflows altında geçerli bir YAML workflow var', async () => {
    const files = workflows()
    expect(files.length, '.github/workflows/ci.yml oluştur').toBeGreaterThan(0)
    for (const file of files) {
      await expect(prettier.format(file.text, { parser: 'yaml' }), file.name).resolves.toBeTypeOf(
        'string',
      )
    }
  })

  it('push ve pull_request olaylarında çalışır', () => {
    const text = workflows()
      .map((f) => f.text)
      .join('\n')
    expect(text).toMatch(/\bpush\b/)
    expect(text).toMatch(/\bpull_request\b/)
  })

  it('kodu alır, pnpm ve Node’u kurar, bağımlılıkları yükler', () => {
    const text = workflows()
      .map((f) => f.text)
      .join('\n')
    expect(text).toMatch(/actions\/checkout@/)
    expect(text).toMatch(/actions\/setup-node@/)
    expect(text).toMatch(/pnpm\/action-setup@|corepack enable/)
    expect(text).toMatch(/pnpm (install|i)\b/)
  })

  it('kalite kapısı: lint, tip kontrolü (typecheck ya da build) ve birim testleri çalıştırır', () => {
    const text = workflows()
      .map((f) => f.text)
      .join('\n')
    expect(text).toMatch(/pnpm (run )?lint\b/)
    expect(text).toMatch(/pnpm (run )?(typecheck|build)\b/)
    expect(text).toMatch(/pnpm (run )?test(?!:)\b/)
  })

  it('tarayıcıları kurup E2E testlerini çalıştırır', () => {
    const text = workflows()
      .map((f) => f.text)
      .join('\n')
    expect(text).toMatch(/playwright install/)
    expect(text).toMatch(/pnpm (run )?test:e2e|playwright test/)
  })
})
