import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { inProject } from './project-tools'

/** src altındaki test olmayan TypeScript dosyaları */
function sources() {
  return readdirSync(inProject('src'), { recursive: true, encoding: 'utf8' })
    .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f))
    .map((f) => ({ path: `src/${f}`, text: readFileSync(join(inProject('src'), f), 'utf8') }))
}

describe('MSW ile sahte Open Library', () => {
  it('handler’lar arama (search.json), eser (/works/) ve yazar (/authors/) uçlarını taklit eder', () => {
    const handlers = sources().filter((f) => /http\.get\s*\(/.test(f.text))
    const all = handlers.map((f) => f.text).join('\n')
    expect(handlers.length, 'http.get(...) içeren bir handlers dosyası yok').toBeGreaterThan(0)
    expect(all).toMatch(/search\.json/)
    expect(all).toMatch(/\/works\//)
    expect(all).toMatch(/\/authors\//)
  })

  it('olmayan eser için Open Library gibi 404 döner (hata yolu da test edilebilir)', () => {
    const all = sources()
      .filter((f) => /http\.get\s*\(/.test(f.text))
      .map((f) => f.text)
      .join('\n')
    expect(all).toMatch(/status:\s*404/)
  })
})
