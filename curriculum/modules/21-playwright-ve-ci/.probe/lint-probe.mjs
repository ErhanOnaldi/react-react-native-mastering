import { ESLint } from 'eslint'
const root = '/Users/erhanonaldi/projects/react_mastering/curriculum/checkpoints/sinema/18'
const lint = new ESLint({ cwd: root })
const src = `import { test as base } from '@playwright/test'
class LoginPage { constructor(readonly page: unknown) {} }
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
})
`
const [r] = await lint.lintText(src, { filePath: root + '/e2e/fixtures.ts' })
console.log(JSON.stringify(r.messages.map(m => [m.ruleId, m.message]), null, 1))
