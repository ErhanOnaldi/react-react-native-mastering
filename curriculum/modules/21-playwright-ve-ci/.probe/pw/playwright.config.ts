import { defineConfig } from '@playwright/test'
export default defineConfig({ testDir: './e2e', use: { baseURL: 'https://sinema.test' } })
