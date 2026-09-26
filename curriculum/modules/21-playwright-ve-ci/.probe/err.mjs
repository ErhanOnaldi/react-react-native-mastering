import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage()
await p.setContent('<button>Kaydet</button><button>Kaydet</button>')
try { await p.getByRole('button', { name: 'Kaydet' }).click({ timeout: 1000 }) } catch (e) { console.log(e.message.split('\n').slice(0,6).join('\n')) }
console.log('-----')
await p.setContent('<div style="position:fixed;inset:0;background:rgba(0,0,0,.5)" class="fixed inset-0 bg-black/50"></div><button>Kaydet</button>')
try { await p.getByRole('button', { name: 'Kaydet' }).click({ timeout: 2000 }) } catch (e) { console.log(e.message.split('\n').slice(0,14).join('\n')) }
console.log('-----')
await p.setContent('<button disabled>Kaydet</button>')
try { await p.getByRole('button', { name: 'Kaydet' }).click({ timeout: 1500 }) } catch (e) { console.log(e.message.split('\n').slice(0,10).join('\n')) }
await b.close()
