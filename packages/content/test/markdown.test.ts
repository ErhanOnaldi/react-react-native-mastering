import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  checkDiagrams,
  checkSvg,
  extractCheckedCodeBlocks,
  renderMarkdown,
} from '../src/markdown.ts'

const SVG =
  '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40">' +
  '<defs><marker id="ok"><path d="M0 0L5 5"/></marker></defs>' +
  '<line class="d-line" x1="0" y1="0" x2="10" y2="0" marker-end="url(#ok)"/></svg>'

async function diagramDirs() {
  const root = await mkdtemp(path.join(tmpdir(), 'rm-diagram-'))
  const lessonDir = path.join(root, 'lesson')
  const diagramsDir = path.join(root, 'diagrams')
  await mkdir(path.join(lessonDir, 'diagrams'), { recursive: true })
  await mkdir(diagramsDir)
  await writeFile(path.join(diagramsDir, 'render-commit.svg'), SVG)
  await writeFile(path.join(lessonDir, 'diagrams', 'akis.svg'), SVG)
  await writeFile(
    path.join(lessonDir, 'diagrams', 'kotu.svg'),
    SVG.replace('<defs>', '<script>x()</script><defs>'),
  )
  return { baseDir: lessonDir, diagramsDir }
}

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

describe('diyagramlar', () => {
  it('ortak diyagramı figure içinde satır içi SVG yapar ve id’leri öneklendirir', async () => {
    const options = await diagramDirs()
    const html = await renderMarkdown('![Render ve commit](diagram:render-commit)', options)
    expect(html).toContain('<figure class="diagram"><svg role="img" aria-label="Render ve commit"')
    expect(html).toContain('<figcaption>Render ve commit</figcaption>')
    expect(html).not.toContain('<?xml')
    const id = /<marker id="(d[0-9a-f]{6}-ok)"/.exec(html)?.[1]
    expect(id).toBeDefined()
    expect(html).toContain(`url(#${id})`)
  })

  it('dersin kendi klasöründeki diyagramı çözer, başlık varsa altyazı olarak kullanır', async () => {
    const options = await diagramDirs()
    const html = await renderMarkdown('![Akış](diagrams/akis.svg "Veri akışı")', options)
    expect(html).toContain('aria-label="Akış"')
    expect(html).toContain('<figcaption>Veri akışı</figcaption>')
  })

  it('güvensiz ya da eksik SVG yerine hata mesajı gösterir', async () => {
    const options = await diagramDirs()
    const bad = await renderMarkdown('![Kötü](diagrams/kotu.svg)', options)
    expect(bad).toContain('class="diagram-error"')
    expect(bad).not.toContain('<script>')
    const missing = await renderMarkdown('![Yok](diagram:yok)', options)
    expect(missing).toContain('Diyagram bulunamadı: yok.svg')
  })

  it('markdown içindeki ham HTML yine atılır', async () => {
    const html = await renderMarkdown('<script>alert(1)</script>\n\n<b>kalın</b> metin')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<b>')
  })

  it('checkSvg yasak içerikleri raporlar', () => {
    expect(checkSvg(SVG)).toEqual([])
    expect(checkSvg('<svg viewBox="0 0 1 1"><style>p{}</style></svg>')).toEqual([
      expect.stringContaining('<style>'),
    ])
    expect(checkSvg('<svg><rect onclick="x()"/></svg>')).toEqual([
      expect.stringContaining('viewBox'),
      expect.stringContaining('olay öznitelikleri'),
    ])
  })

  it('checkDiagrams alt metni, yerleşimi ve dosyayı denetler', async () => {
    const options = await diagramDirs()
    const problems = checkDiagrams(
      [
        '![](diagram:render-commit)',
        '',
        'Metin ![Satır içi](diagrams/akis.svg) devam',
        '',
        '![Yok](diagram:yok)',
      ].join('\n'),
      options,
    )
    expect(problems.map((p) => [p.line, p.message])).toEqual([
      [1, expect.stringContaining('alt metni')],
      [3, expect.stringContaining('tek başına')],
      [5, expect.stringContaining('bulunamadı')],
    ])
  })
})

describe('Zihinsel model kutusu', () => {
  it(':::model varsayılan başlığı kullanır', async () => {
    const html = await renderMarkdown(':::model\nRender bir hesaplamadır.\n:::')
    expect(html).toContain('data-kind="model" data-title="Zihinsel model"')
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
