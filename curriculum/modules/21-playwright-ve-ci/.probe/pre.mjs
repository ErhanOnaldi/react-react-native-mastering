import { chromium } from '@playwright/test'
const b = await chromium.launch()
const ctx = await b.newContext({ baseURL: 'https://sinema.test' })
await ctx.route('https://sinema.test/**', r => r.fulfill({ contentType: 'text/html', body: '<nav aria-label="Ana menü"><a href="/">Ana sayfa</a> · <a href="/search">Ara</a> · <a href="/w">İzleme listelerim</a></nav><h1>Sinema</h1>' }))
const seen = []
const p = await ctx.newPage()
await p.route('https://api.themoviedb.org/**', r => { seen.push(r.request().method() + ' ' + r.request().url()); return r.fulfill({ json: { ok: 1 } }) })
await p.route('https://dummyjson.com/**', r => { seen.push(r.request().method() + ' ' + r.request().url()); return r.fulfill({ json: { ok: 2 } }) })
await p.goto('/')
const out = await p.evaluate(async () => {
  const a = await (await fetch('https://api.themoviedb.org/3/movie/1', { headers: { Authorization: 'Bearer x' } })).json()
  const b = await (await fetch('https://dummyjson.com/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"a":1}' })).json()
  let c = 'ok'
  try { await fetch('https://api.themoviedb.org/3/x') } catch (e) { c = String(e) }
  return [a, b, c]
})
console.log(JSON.stringify(out), seen)
const { expect } = await import('@playwright/test')
try {
  await expect(p.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(`
    - navigation "Ana menü":
      - link "Ana sayfa"
      - link "Ara"
      - link "İzleme listelerim"
  `, { timeout: 1000 })
  console.log('aria snapshot 1 OK')
} catch (e) { console.log('ARIA1', e.message.slice(0, 600)) }
try {
  await expect(p.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(`
    - link "Ana sayfa"
    - link "Ara"
  `, { timeout: 1000 })
  console.log('aria snapshot 2 OK')
} catch (e) { console.log('ARIA2', e.message.slice(0, 600)) }
console.log(await p.getByRole('navigation').ariaSnapshot())
await b.close()
