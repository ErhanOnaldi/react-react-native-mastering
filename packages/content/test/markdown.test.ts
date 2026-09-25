import { describe, expect, it } from 'vitest'
import { extractCheckedCodeBlocks, renderMarkdown } from '../src/markdown.ts'

describe('renderMarkdown', () => {
  it('bilgi kutularını aside olarak üretir', async () => {
    const html = await renderMarkdown(':::tip[Kısa yol]\nİçerik\n:::')
    expect(html).toContain('<aside class="callout" data-kind="tip" data-title="Kısa yol">')
    expect(html).toContain('<p>İçerik</p>')
  })

  it('başlıksız kutuda varsayılan başlığı kullanır', async () => {
    const html = await renderMarkdown(':::sector\nGerçek hayatta böyle.\n:::')
    expect(html).toContain('data-title="Sektörde"')
  })

  it('metin içindeki iki noktayı direktif sanmaz', async () => {
    const html = await renderMarkdown("Saat 10:30'da. Not:önemli değil.")
    expect(html).toContain('Not:önemli değil.')
  })

  it('kodu Shiki ile iki temalı renklendirir ve başlığı ekler', async () => {
    const html = await renderMarkdown('```tsx title="App.tsx" check\nconst a = 1\n```')
    expect(html).toContain('data-title="App.tsx"')
    expect(html).toContain('data-lang="tsx"')
    expect(html).toContain('--shiki-dark')
  })
})

describe('extractCheckedCodeBlocks', () => {
  it('yalnızca check işaretli ts/tsx bloklarını çıkarır', () => {
    const md = [
      '```ts check',
      'const a: number = 1',
      '```',
      '',
      '```ts',
      'const b = 2',
      '```',
      '',
      '```tsx title="x.tsx" check',
      'const c = <div />',
      '```',
    ].join('\n')
    const blocks = extractCheckedCodeBlocks(md)
    expect(blocks.map((b) => b.code)).toEqual(['const a: number = 1', 'const c = <div />'])
    expect(blocks[0]?.line).toBe(1)
  })
})
