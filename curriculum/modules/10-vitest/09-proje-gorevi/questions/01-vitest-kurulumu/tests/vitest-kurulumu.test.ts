import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatDate, formatVote, releaseYear } from '@project/src/shared/lib/format'

const root = process.env.RM_PROJECT_DIR!
const read = (path: string) => readFileSync(join(root, path), 'utf8')

describe('Sinema Vitest kurulumu', () => {
  it('tek seferlik test script’i ve jsdom ortamı tanımlıdır', () => {
    const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string> }
    expect(pkg.scripts.test).toMatch(/\bvitest\s+run\b/)
    const config = read('vite.config.ts')
    expect(config).toMatch(/from\s+['"]vitest\/config['"]/)
    expect(config).toMatch(/\btest\s*:\s*\{/)
    expect(config).toMatch(/environment\s*:\s*['"]jsdom['"]/)
    expect(config).toMatch(/globals\s*:\s*false/)
  })

  it('format test dosyası gerçek assertion içerir', () => {
    const path = join(root, 'src/shared/lib/format.test.ts')
    expect(existsSync(path)).toBe(true)
    const source = readFileSync(path, 'utf8')
    expect(source).toMatch(/\b(?:it|test)(?:\.each)?\s*\(/)
    expect(source).toMatch(/\bexpect\s*\(/)
    expect(source).toMatch(/\bformatVote\b/)
    expect(source).toMatch(/\breleaseYear\b/)
    expect(source).toMatch(/\bformatDate\b/)
  })

  it('puan ve boş tarih sözleşmesi projede korunur', () => {
    expect(formatVote(8)).toBe('8.0')
    expect(formatVote(0)).toBe('Henüz oy yok')
    expect(releaseYear('')).toBe('')
    expect(formatDate('')).toBe('Tarih yok')
  })
})
