import { describe, expect, it } from 'vitest'
import { ciSteps } from '@exercise/ciSteps'

describe('ciSteps', () => {
  it('kilit dosyasına sadık kurulumu ilk adım yapar', () => {
    expect(ciSteps()[0]).toBe('pnpm install --frozen-lockfile')
  })
  it('lint, tip kontrolü ve Vitest testlerini E2E öncesinde çalıştırır', () => {
    const steps = ciSteps()
    expect(steps.slice(1, 4)).toEqual(['pnpm lint', 'pnpm typecheck', 'pnpm test'])
  })
  it('Chromium ve sistem bağımlılıklarını E2E’den önce kurar', () => {
    const steps = ciSteps()
    expect(steps[4]).toMatch(/playwright install --with-deps chromium/)
    expect(steps[5]).toBe('npx playwright test')
  })
})
