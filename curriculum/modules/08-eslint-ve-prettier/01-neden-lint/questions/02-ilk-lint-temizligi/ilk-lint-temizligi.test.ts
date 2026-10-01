import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'
import { movieSource } from '@exercise/movieSource'

const lint = new ESLint({
  overrideConfigFile: true,
  allowInlineConfig: false,
  overrideConfig: [
    {
      files: ['**/*.tsx'],
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      rules: { 'no-unused-vars': 'error' },
    },
  ],
})

describe('ilk lint temizliği', () => {
  it('kullanılmayan import için sıfır lint hatası verir', async () => {
    const [result] = await lint.lintText(movieSource, { filePath: 'MovieTitle.tsx' })
    expect(result.errorCount).toBe(0)
    expect(result.fatalErrorCount).toBe(0)
  })
  it('film başlığını ekranda tutan bileşeni korur', () => {
    expect(movieSource).toMatch(/export function MovieTitle/)
    expect(movieSource).toMatch(/MovieTitle\(\{ title \}\)/)
    expect(movieSource).toMatch(/<h1>\{title\}<\/h1>/)
  })
})
