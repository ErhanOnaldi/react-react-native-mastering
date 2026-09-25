import { describe, expect, it } from 'vitest'
import pkg from '@project/package.json'

describe('Sinema package.json', () => {
  it('"typecheck" script’i tanımlı', () => {
    expect(pkg.scripts).toHaveProperty('typecheck')
  })

  it('typecheck script’i "tsc -b" çalıştırıyor', () => {
    expect((pkg.scripts as Record<string, string>).typecheck).toMatch(/^tsc -b\b/)
  })

  it('build script’i hâlâ tip kontrolüyle başlıyor', () => {
    expect(pkg.scripts.build).toBe('tsc -b && vite build')
  })
})
