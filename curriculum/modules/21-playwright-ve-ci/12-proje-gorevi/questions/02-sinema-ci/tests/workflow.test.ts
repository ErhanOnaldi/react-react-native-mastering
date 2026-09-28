// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const project = process.env.RM_PROJECT_DIR ?? ''
const local = join(project, '.github/workflows/sinema-ci.yml')
const path = existsSync(local)
  ? local
  : join(resolve(project, '../..'), '.github/workflows/sinema-ci.yml')
const workflow = existsSync(path) ? readFileSync(path, 'utf8') : ''

function at(command: RegExp) {
  const match = command.exec(workflow)
  expect(match, `${command} workflow’da bulunmalı`).not.toBeNull()
  return match?.index ?? -1
}

describe('Sinema CI workflow', () => {
  it('önceki checkpoint’te olmayan E2E paketiyle birlikte kurulur', () => {
    expect(existsSync(join(project, 'e2e/search.spec.ts'))).toBe(true)
    expect(existsSync(join(project, 'e2e/auth-watchlist.spec.ts'))).toBe(true)
  })

  it('push ve pull request ile Ubuntu üzerinde çalışır', () => {
    expect(workflow).toMatch(/(?:^|\n)on\s*:/)
    expect(workflow).toMatch(/push/)
    expect(workflow).toMatch(/pull_request/)
    expect(workflow).toMatch(/ubuntu-/)
  })

  it('checkout, pnpm ve Node kurulumundan sonra kilitli bağımlılıkları kurar', () => {
    expect(at(/actions\/checkout@/)).toBeLessThan(at(/pnpm\/action-setup@/))
    expect(at(/pnpm\/action-setup@/)).toBeLessThan(at(/actions\/setup-node@/))
    expect(at(/actions\/setup-node@/)).toBeLessThan(at(/pnpm install --frozen-lockfile/))
  })

  it('Sinema dizininde lint, typecheck, Vitest ve Chromium E2E adımlarını sıralar', () => {
    expect(workflow).toMatch(/projects\/sinema/)
    const steps = [
      at(/pnpm lint/),
      at(/pnpm typecheck/),
      at(/pnpm test(?:\s|$)/),
      at(/playwright install --with-deps chromium/),
      at(/playwright test(?:\s|$)/),
    ]
    expect(steps).toEqual([...steps].sort((a, b) => a - b))
  })

  it('hata durumunda Playwright trace dosyalarını artifact olarak saklar', () => {
    expect(workflow).toMatch(/actions\/upload-artifact@/)
    expect(workflow).toMatch(/failure\(\)/)
    expect(workflow).toMatch(/test-results\//)
  })
})
