import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { detailsSource } from '@exercise/detailsSource'

const lint = new ESLint({
  overrideConfigFile: true,
  allowInlineConfig: false,
  overrideConfig: [...tseslint.configs.recommended, reactHooks.configs.flat.recommended],
})

describe('detay sayfası effect’i', () => {
  it('exhaustive-deps uyarısı üretmez', async () => {
    const [result] = await lint.lintText(detailsSource, { filePath: 'MovieDetails.tsx' })
    expect(result.messages.filter((m) => m.ruleId === 'react-hooks/exhaustive-deps')).toHaveLength(
      0,
    )
    expect(result.errorCount).toBe(0)
  })
  it('id ile başlığı güncelleyen effect’i korur', () => {
    expect(detailsSource).toMatch(/document\.title\s*=.*id/)
    expect(detailsSource).toMatch(/useEffect/)
    expect(detailsSource).toMatch(/<h1>Film \{id\}<\/h1>/)
  })
})
