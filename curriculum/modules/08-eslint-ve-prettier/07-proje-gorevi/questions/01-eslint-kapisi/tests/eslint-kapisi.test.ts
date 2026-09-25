import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.env.RM_PROJECT_DIR!
const configFile = join(root, 'eslint.config.js')

describe('Sinema ESLint kapısı', () => {
  it('proje kökünde ESLint 10 flat config dosyası bulunur', () => {
    expect(existsSync(configFile)).toBe(true)
  })
  it('TypeScript dosyasında kullanılmayan değişkeni yakalar', async () => {
    const lint = new ESLint({ cwd: root, overrideConfigFile: configFile })
    const [result] = await lint.lintText(
      "const unused: string = 'Dövüş Kulübü'\nexport const title = 'Sinema'",
      { filePath: join(root, 'src/lint-probe.ts') },
    )
    expect(result.messages.some((m) => m.ruleId === '@typescript-eslint/no-unused-vars')).toBe(true)
  })
  it('TSX dosyasında eksik effect bağımlılığını yakalar', async () => {
    const lint = new ESLint({ cwd: root, overrideConfigFile: configFile })
    const source =
      "import { useEffect } from 'react'\nexport function Detail({ id }: { id: string }) { useEffect(() => { document.title = id }, []); return <h1>{id}</h1> }"
    const [result] = await lint.lintText(source, { filePath: join(root, 'src/LintProbe.tsx') })
    expect(result.messages.some((m) => m.ruleId === 'react-hooks/exhaustive-deps')).toBe(true)
  })
  it('React Refresh kuralını TSX bileşen dosyasında uygular', async () => {
    const lint = new ESLint({ cwd: root, overrideConfigFile: configFile })
    const source =
      "export const helper = () => 'film'; export function Detail() { return <h1>Sinema</h1> }"
    const [result] = await lint.lintText(source, { filePath: join(root, 'src/Detail.tsx') })
    expect(result.messages.some((m) => m.ruleId === 'react-refresh/only-export-components')).toBe(
      true,
    )
  })
  it('React Compiler için immutability kuralını açar', async () => {
    const lint = new ESLint({ cwd: root, overrideConfigFile: configFile })
    const config = await lint.calculateConfigForFile(join(root, 'src/LintProbe.tsx'))
    expect(config.rules['react-hooks/immutability']?.[0]).toBe(2)
  })
})
