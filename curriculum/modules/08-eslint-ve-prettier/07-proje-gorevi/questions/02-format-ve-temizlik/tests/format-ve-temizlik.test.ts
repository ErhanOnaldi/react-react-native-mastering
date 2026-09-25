import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ESLint } from 'eslint'
import * as prettier from 'prettier'

const root = process.env.RM_PROJECT_DIR!
const read = (name: string) => readFileSync(join(root, name), 'utf8')

describe('Sinema format ve lint temizliği', () => {
  it('Prettier config’i tek tırnak, noktalı virgülsüz ve Tailwind v4 stylesheet yolunu tanımlar', async () => {
    const config = JSON.parse(read('.prettierrc.json')) as Record<string, unknown>
    expect(config.singleQuote).toBe(true)
    expect(config.semi).toBe(false)
    expect(config.plugins).toContain('prettier-plugin-tailwindcss')
    expect(config.tailwindStylesheet).toBe('./src/index.css')
    const result = await prettier.format('const title = "Dövüş Kulübü";', {
      parser: 'typescript',
      singleQuote: config.singleQuote as boolean,
      semi: config.semi as boolean,
    })
    expect(result).toBe("const title = 'Dövüş Kulübü'\n")
  })
  it('üretilen klasörleri Prettier kontrolünden çıkarır', () => {
    const ignored = read('.prettierignore')
    expect(ignored).toMatch(/(^|\n)\/?dist\/?(\n|$)/)
    expect(ignored).toMatch(/(^|\n)\/?coverage\/?(\n|$)/)
  })
  it('lint, format ve format:check script’leri tanımlıdır', () => {
    const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string> }
    expect(pkg.scripts.lint).toMatch(/^eslint \.($|\s)/)
    expect(pkg.scripts.format).toMatch(/^prettier --write \.($|\s)/)
    expect(pkg.scripts['format:check']).toMatch(/^prettier --check \.($|\s)/)
  })
  it('src altındaki TypeScript ve TSX dosyalarında lint hatası kalmaz', async () => {
    const lint = new ESLint({
      cwd: root,
      overrideConfigFile: join(root, 'eslint.config.js'),
      allowInlineConfig: false,
    })
    const results = await lint.lintFiles(['src/**/*.{ts,tsx}'])
    expect(results.length).toBeGreaterThan(0)
    expect(
      results.flatMap((r) =>
        r.messages.filter((m) => m.severity === 2).map((m) => `${r.filePath}: ${m.message}`),
      ),
    ).toEqual([])
  })
})
