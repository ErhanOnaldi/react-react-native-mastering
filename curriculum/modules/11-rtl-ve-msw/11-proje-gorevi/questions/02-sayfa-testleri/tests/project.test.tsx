import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
const root = process.env.RM_PROJECT_DIR!
function source(path: string) {
  const full = join(root, path)
  expect(existsSync(full)).toBe(true)
  return readFileSync(full, 'utf8')
}
describe('Sinema sayfa bileşen testleri', () => {
  it('SearchPage kullanıcı etkileşimi, asenkron sonuç, boş ve hata vakalarını sınar', () => {
    const text = source('src/pages/SearchPage.test.tsx')
    expect(text).toMatch(/userEvent\.setup\s*\(/)
    expect(text).toMatch(/(?:findBy|waitFor)/)
    expect(text).toMatch(/server\.use\s*\(/)
    expect(text).toMatch(/expect\s*\(/)
    expect(text).toMatch(/Matrix/)
    expect(text).toMatch(/results\s*:\s*\[\]/)
    expect(text).toMatch(/500/)
  })
  it('MovieDetailsPage 550 ve 404 sonucunu görünür içerikle sınar', () => {
    const text = source('src/pages/MovieDetailsPage.test.tsx')
    expect(text).toMatch(/renderWithRouter/)
    expect(text).toMatch(/(?:findBy|waitFor)/)
    expect(text).toMatch(/Dövüş Kulübü/)
    expect(text).toMatch(/550/)
    expect(text).toMatch(/404|999999/)
    expect(text).toMatch(/expect\s*\(/)
  })
})
