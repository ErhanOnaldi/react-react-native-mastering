import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ESLint } from 'eslint'
import * as prettier from 'prettier'
import { describe, expect, it } from 'vitest'
import { firstExisting, inProject, read, root } from './project-tools'

const eslintConfig = firstExisting(['eslint.config.js', 'eslint.config.mjs', 'eslint.config.ts'])
const eslint = () => new ESLint({ cwd: root, overrideConfigFile: eslintConfig })
const severity = (entry: unknown) => (Array.isArray(entry) ? entry[0] : entry)

describe('ESLint (flat config)', () => {
  it('proje kökünde kendi eslint.config dosyası var (üst klasördekine yaslanmaz)', () => {
    expect(eslintConfig).toBeDefined()
  })

  it('TSX dosyalarında hook kuralları, TypeScript kuralları ve React Refresh açık', async () => {
    const config = await eslint().calculateConfigForFile(inProject('src', 'Probe.tsx'))
    expect(severity(config.rules['react-hooks/rules-of-hooks'])).toBe(2)
    expect(severity(config.rules['react-hooks/exhaustive-deps'])).toBeGreaterThanOrEqual(1)
    expect(severity(config.rules['@typescript-eslint/no-unused-vars'])).toBeGreaterThanOrEqual(1)
    expect(config.rules['react-refresh/only-export-components']).toBeDefined()
  })

  it('koşullu hook çağrısını hata olarak yakalar', async () => {
    const source = [
      "import { useState } from 'react'",
      'export function Probe({ open }: { open: boolean }) {',
      '  if (open) {',
      '    const [n] = useState(0)',
      '    return <p>{n}</p>',
      '  }',
      '  return null',
      '}',
    ].join('\n')
    const [result] = await eslint().lintText(source, { filePath: inProject('src', 'Probe.tsx') })
    expect(result!.messages.map((m) => m.ruleId)).toContain('react-hooks/rules-of-hooks')
  })

  it('eslint-config-prettier en sonda: biçim kuralları kapalı', async () => {
    const config = await eslint().calculateConfigForFile(inProject('src', 'Probe.tsx'))
    // js.configs.recommended bu kuralı açar; eslint-config-prettier sonda gelirse kapatır
    expect(severity(config.rules['no-unexpected-multiline'])).toBe(0)
  })

  it('src altında lint hatası yok', async () => {
    const results = await eslint().lintFiles(['src'])
    const errors = results.flatMap((r) =>
      r.messages
        .filter((m) => m.severity === 2)
        .map((m) => `${r.filePath.slice(root.length + 1)}:${m.line} ${m.ruleId}`),
    )
    expect(results.length).toBeGreaterThan(0)
    expect(errors).toEqual([])
  })
})

describe('Prettier', () => {
  it('proje kökünde kendi Prettier ayarı var', async () => {
    const file = await prettier.resolveConfigFile(inProject('src', 'main.tsx'))
    expect(file, 'Prettier ayarı bulunamadı').not.toBeNull()
    expect(file!.startsWith(root), `Bulunan ayar projenin dışında: ${file}`).toBe(true)
  })

  it('src altındaki tüm dosyalar Prettier biçiminde (format:check temiz)', async () => {
    const files = readdirSync(inProject('src'), { recursive: true, encoding: 'utf8' }).filter((f) =>
      /\.(ts|tsx|css)$/.test(f),
    )
    const unformatted: string[] = []
    for (const file of files) {
      const filepath = join(root, 'src', file)
      const options = await prettier.resolveConfig(filepath)
      if (!(await prettier.check(read('src', file), { ...options, filepath }))) {
        unformatted.push(`src/${file}`)
      }
    }
    expect(unformatted, 'pnpm format ile düzelt').toEqual([])
  })
})
