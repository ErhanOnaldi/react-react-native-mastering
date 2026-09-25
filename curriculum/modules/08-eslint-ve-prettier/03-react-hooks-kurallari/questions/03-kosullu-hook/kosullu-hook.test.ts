import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { hookSource } from '@exercise/hookSource'

const lint = new ESLint({
  overrideConfigFile: true,
  allowInlineConfig: false,
  overrideConfig: [...tseslint.configs.recommended, reactHooks.configs.flat.recommended],
})

describe('koşullu Hook', () => {
  it('rules-of-hooks hatası üretmez', async () => {
    const [result] = await lint.lintText(hookSource, { filePath: 'MovieNotice.tsx' })
    expect(result.messages.filter((m) => m.ruleId === 'react-hooks/rules-of-hooks')).toHaveLength(0)
    expect(result.errorCount).toBe(0)
  })
  it('boş film ve dolu film mesajlarını korur', () => {
    expect(hookSource).toMatch(/Film seç/)
    expect(hookSource).toMatch(/Film \{id\}/)
    expect(hookSource).toMatch(/document\.title/)
  })
})
