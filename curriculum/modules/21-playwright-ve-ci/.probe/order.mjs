import { chromium } from '@playwright/test'
const b = await chromium.launch()
const ctx = await b.newContext({ baseURL: 'https://sinema.test' })
await ctx.route('https://sinema.test/**', r => r.fulfill({ contentType: 'text/html', body: '<p>x</p>' }))
const p = await ctx.newPage()
await p.route('https://api.themoviedb.org/3/**', (route) => route.fulfill({ status: 500, json: { m: 'genel' } }))
await p.route('https://api.themoviedb.org/3/movie/550*', (route) => route.fulfill({ json: { m: '550' } }))
await p.goto('/')
const out = await p.evaluate(async () => {
  const a = await fetch('https://api.themoviedb.org/3/trending/movie/week?language=tr-TR&page=1')
  const b = await fetch('https://api.themoviedb.org/3/movie/550?append_to_response=credits,videos&language=tr-TR')
  const c = await fetch('https://api.themoviedb.org/3/movie/550/credits?language=tr-TR')
  return [a.status + ':' + (await a.text()), b.status + ':' + (await b.text()), c.status + ':' + (await c.text())]
})
console.log(out)
// fallback
await p.route('https://api.themoviedb.org/3/movie/**', (route) => route.fallback())
console.log(await p.evaluate(async () => { const a = await fetch('https://api.themoviedb.org/3/movie/550?x=1'); return a.status + ':' + (await a.text()) }))
await b.close()
