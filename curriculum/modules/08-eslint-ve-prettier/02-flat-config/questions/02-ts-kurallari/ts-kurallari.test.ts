import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'
import { config } from '@exercise/lintConfig'

const lint = new ESLint({ overrideConfigFile: true, overrideConfig: config })

describe('TypeScript flat config', () => {
  it('TS dosyasında kullanılmayan import’u yakalar', async () => {
    const [result] = await lint.lintText(
      "import { useState } from 'react'\nexport const title = 'Sinema'",
      { filePath: 'src/movie.ts' },
    )
    expect(result.messages.some((m) => m.ruleId === '@typescript-eslint/no-unused-vars')).toBe(true)
  })
  it('TSX dosyasında kullanılmayan değişkeni yakalar', async () => {
    const [result] = await lint.lintText(
      "const forgotten: string = 'Dövüş Kulübü'\nexport function Header() { return <h1>Sinema</h1> }",
      { filePath: 'src/Header.tsx' },
    )
    expect(result.messages.some((m) => m.ruleId === '@typescript-eslint/no-unused-vars')).toBe(true)
  })
  it('kullanılan TypeScript değişkenine hata vermez', async () => {
    const [result] = await lint.lintText(
      "const title: string = 'Dövüş Kulübü'\nexport const heading = title",
      { filePath: 'src/title.ts' },
    )
    expect(result.errorCount).toBe(0)
  })
})
