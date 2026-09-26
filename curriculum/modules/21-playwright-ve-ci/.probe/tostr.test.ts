// @vitest-environment node
import { writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
import { expect, it } from 'vitest'
import { main } from '@exercise/app'

it('toString works in browser', async () => {
  writeFileSync(process.env.OUT_FILE!, main.toString())
  const b = await chromium.launch()
  const page = await b.newPage()
  await page.setContent(
    `<div id="root"></div><script>(${main.toString()})(${JSON.stringify({ title: 'Sinema' })})</script>`,
  )
  await page.waitForTimeout(100)
  expect(await page.locator('h1').textContent()).toBe('Sinema!')
  await b.close()
}, 20000)
