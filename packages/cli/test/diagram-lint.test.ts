import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { lintDiagramLayout } from '../src/diagram-lint.ts'

const svg = (body: string, height = 200) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 ${height}"><title>t</title>${body}</svg>`

describe('lintDiagramLayout', () => {
  it('temiz diyagramda sorun bildirmez', async () => {
    const file = path.resolve(import.meta.dirname, '../../../curriculum/diagrams/render-commit.svg')
    expect(lintDiagramLayout(await readFile(file, 'utf8'))).toEqual([])
  })

  it('kutudan taşan metni yakalar', () => {
    const problems = lintDiagramLayout(
      svg(
        '<rect class="d-box" x="200" y="20" width="100" height="60"/>' +
          '<text class="d-text" x="250" y="55" text-anchor="middle">çok uzun bir kutu etiketi</text>',
      ),
    )
    expect(problems).toEqual([expect.stringContaining('kutusundan taşıyor')])
  })

  it('çizim alanının dışına taşan metni yakalar', () => {
    const problems = lintDiagramLayout(
      svg(
        '<text class="d-muted" x="740" y="30" text-anchor="middle">sağ kenarda uzun etiket</text>',
      ),
    )
    expect(problems).toEqual([expect.stringContaining('viewBox')])
  })

  it('metnin üstünden geçen çizgiyi ve kutunun içinden geçen çizgiyi yakalar', () => {
    const problems = lintDiagramLayout(
      svg(
        '<rect class="d-box" x="200" y="40" width="120" height="60"/>' +
          '<text class="d-text" x="500" y="75" text-anchor="middle">etiket</text>' +
          '<line class="d-line" x1="20" y1="70" x2="740" y2="70"/>',
      ),
    )
    expect(problems).toEqual(
      expect.arrayContaining([
        expect.stringContaining('"etiket" metninin üstünden geçiyor'),
        expect.stringContaining('kutunun içinden geçiyor'),
      ]),
    )
  })

  it('marker içindeki ok ucunu çizgi saymaz, kutu kenarında biten oku sorun saymaz', () => {
    const problems = lintDiagramLayout(
      svg(
        '<defs><marker id="m"><path class="d-arrowhead" d="M0 0 L10 5 L0 10 z"/></marker></defs>' +
          '<rect class="d-box" x="20" y="40" width="120" height="60"/>' +
          '<rect class="d-box" x="300" y="40" width="120" height="60"/>' +
          '<line class="d-line" x1="140" y1="70" x2="296" y2="70" marker-end="url(#m)"/>',
      ),
    )
    expect(problems).toEqual([])
  })
})
