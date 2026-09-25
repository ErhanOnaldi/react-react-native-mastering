import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export const config = defineConfig({
  files: ['**/*.{ts,tsx}'],
  extends: [tseslint.configs.recommended],
  rules: { '@typescript-eslint/no-unused-vars': 'error' },
})
