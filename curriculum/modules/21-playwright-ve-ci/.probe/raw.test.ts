// @vitest-environment node
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import { chromium, expect as pw } from '@playwright/test'
import { describe, expect, it } from 'vitest'
import workflow from '@exercise/ci.yml?raw'

describe('raw', () => {
  it('reads yaml', () => {
    expect(workflow).toContain('on:')
  })
  it('pw expect default timeout', async () => {
    const b = await chromium.launch()
    const page = await b.newPage()
    await page.setContent('<p>a</p>')
    const t = Date.now()
    await pw(page.getByText('yok'))
      .toBeVisible()
      .catch((e: Error) =>
        require('node:fs').appendFileSync(
          '/private/tmp/claude-501/-Users-erhanonaldi-projects-react-mastering/e373bf8f-abe6-4835-a996-57be99527aab/scratchpad/exp1/log.txt',
          'ERR ' + e.message + '\n',
        ),
      )
    require('node:fs').appendFileSync(
      '/private/tmp/claude-501/-Users-erhanonaldi-projects-react-mastering/e373bf8f-abe6-4835-a996-57be99527aab/scratchpad/exp1/log.txt',
      'elapsed ' + (Date.now() - t) + '\n',
    )
    await page.localStorage
      .setItem('k', 'v')
      .catch((e: Error) => console.log('LS ERR', e.message.slice(0, 200)))
    await b.close()
  }, 20000)
})
