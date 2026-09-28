/**
 * SVG diyagramları için görsel gerektirmeyen yerleşim denetimi.
 * Metin genişliği karakter bazlı tahmin edilir (Inter / monospace); amaç kesin ölçüm değil,
 * "metin kutudan taşıyor", "çizgi metnin üstünden geçiyor" gibi bariz hataları yakalamak.
 */

interface Box {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface RectEl extends Box {
  className: string
}

interface TextEl extends Box {
  content: string
  anchorX: number
  anchorY: number
}

type Point = [number, number]

const NARROW = new Set([...'iıljtfr.,:;|!\'"()[]{}/\\ ̇'])
const WIDE = new Set([...'mwMWŞĞÖÜ@%'])

function textWidth(content: string, size: number, mono: boolean, bold: boolean) {
  if (mono) return content.length * size * 0.6
  let em = 0
  for (const ch of content) {
    if (ch === ' ') em += 0.28
    else if (NARROW.has(ch)) em += 0.3
    else if (WIDE.has(ch)) em += 0.82
    else if (/[A-ZÇİ0-9]/.test(ch)) em += 0.64
    else if (/[→←↑↓≤≥×·—–]/.test(ch)) em += 0.8
    else em += 0.53
  }
  return em * size * (bold ? 1.06 : 1)
}

function attr(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`).exec(tag)?.[1]
}

function num(tag: string, name: string, fallback = 0) {
  const value = attr(tag, name)
  return value === undefined ? fallback : Number.parseFloat(value)
}

function decode(text: string) {
  return text
    .replace(/<[^>]+>/g, '')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
    .trim()
}

function textStyle(className: string) {
  const classes = className.split(/\s+/)
  const mono = classes.includes('d-code')
  const size = classes.includes('d-muted') ? 12 : mono ? 12.5 : 14
  return { size, mono, bold: classes.includes('d-title') }
}

function makeText(tag: string, x: number, y: number, content: string, className: string): TextEl {
  const { size, mono, bold } = textStyle(className)
  const width = textWidth(
    content,
    Number.parseFloat(attr(tag, 'font-size') ?? '') || size,
    mono,
    bold,
  )
  const anchor = attr(tag, 'text-anchor') ?? 'start'
  const x1 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  const baseline = attr(tag, 'dominant-baseline')
  const top = baseline === 'middle' || baseline === 'central' ? y - size * 0.55 : y - size * 0.78
  return { x1, x2: x1 + width, y1: top, y2: top + size * 1.02, content, anchorX: x, anchorY: y }
}

function parseTexts(svg: string): TextEl[] {
  const texts: TextEl[] = []
  for (const match of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const open = `<text${match[1]}>`
    const inner = match[2]!
    const className = attr(open, 'class') ?? ''
    const x = num(open, 'x')
    const y = num(open, 'y')
    const spans = [...inner.matchAll(/<tspan\b([^>]*)>([\s\S]*?)<\/tspan>/g)]
    if (spans.length && spans.some(([, a]) => /\s(?:x|y|dy)=/.test(a!))) {
      let cy = y
      for (const [, spanAttrs, spanInner] of spans) {
        const spanTag = `<tspan${spanAttrs}>`
        const sx = attr(spanTag, 'x') !== undefined ? num(spanTag, 'x') : x
        if (attr(spanTag, 'y') !== undefined) cy = num(spanTag, 'y')
        else if (attr(spanTag, 'dy') !== undefined) cy += num(spanTag, 'dy')
        const content = decode(spanInner!)
        if (content)
          texts.push(
            makeText(
              open + spanTag,
              sx,
              cy,
              content,
              `${className} ${attr(spanTag, 'class') ?? ''}`,
            ),
          )
      }
    } else {
      const content = decode(inner)
      if (content) texts.push(makeText(open, x, y, content, className))
    }
  }
  return texts
}

function parseRects(svg: string): RectEl[] {
  return [...svg.matchAll(/<rect\b[^>]*>/g)].map(([tag]) => {
    const x = num(tag, 'x')
    const y = num(tag, 'y')
    return {
      x1: x,
      y1: y,
      x2: x + num(tag, 'width'),
      y2: y + num(tag, 'height'),
      className: attr(tag, 'class') ?? '',
    }
  })
}

/** path d → örneklenmiş noktalar (M/L/H/V/C/S/Q/T/Z; mutlak ve göreli). Yaylar (A) doğru parçası sayılır. */
function samplePath(d: string): Point[][] {
  const tokens = [...d.matchAll(/([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/g)].map(
    (m) => m[1] ?? Number(m[2]),
  )
  const lines: Point[][] = []
  let current: Point[] = []
  let cx = 0
  let cy = 0
  let sx = 0
  let sy = 0
  let command = 'M'
  let i = 0
  const next = () => tokens[i++] as number
  const bezier = (points: Point[]) => {
    const out: Point[] = []
    for (let t = 1; t <= 12; t++) {
      const u = t / 12
      let layer = points
      while (layer.length > 1) {
        const reduced: Point[] = []
        for (let k = 0; k < layer.length - 1; k++)
          reduced.push([
            layer[k]![0] + (layer[k + 1]![0] - layer[k]![0]) * u,
            layer[k]![1] + (layer[k + 1]![1] - layer[k]![1]) * u,
          ])
        layer = reduced
      }
      out.push(layer[0]!)
    }
    return out
  }
  while (i < tokens.length) {
    if (typeof tokens[i] === 'string') command = tokens[i++] as string
    const rel = command === command.toLowerCase()
    const ox = rel ? cx : 0
    const oy = rel ? cy : 0
    switch (command.toUpperCase()) {
      case 'M': {
        if (current.length > 1) lines.push(current)
        cx = ox + next()
        cy = oy + next()
        sx = cx
        sy = cy
        current = [[cx, cy]]
        command = rel ? 'l' : 'L'
        break
      }
      case 'L':
      case 'T':
        cx = ox + next()
        cy = oy + next()
        current.push([cx, cy])
        break
      case 'H':
        cx = ox + next()
        current.push([cx, cy])
        break
      case 'V':
        cy = oy + next()
        current.push([cx, cy])
        break
      case 'C': {
        const p1: Point = [ox + next(), oy + next()]
        const p2: Point = [ox + next(), oy + next()]
        const end: Point = [ox + next(), oy + next()]
        current.push(...bezier([[cx, cy], p1, p2, end]))
        ;[cx, cy] = end
        break
      }
      case 'S':
      case 'Q': {
        const p1: Point = [ox + next(), oy + next()]
        const end: Point = [ox + next(), oy + next()]
        current.push(...bezier([[cx, cy], p1, end]))
        ;[cx, cy] = end
        break
      }
      case 'A': {
        for (let k = 0; k < 5; k++) next()
        cx = ox + next()
        cy = oy + next()
        current.push([cx, cy])
        break
      }
      case 'Z':
        current.push([sx, sy])
        cx = sx
        cy = sy
        break
      default:
        i++
    }
  }
  if (current.length > 1) lines.push(current)
  return lines
}

function parseConnectors(svg: string): Point[][] {
  const withoutDefs = svg
    .replace(/<defs\b[\s\S]*?<\/defs>/g, '')
    .replace(/<marker\b[\s\S]*?<\/marker>/g, '')
  const connectors: Point[][] = []
  for (const [tag] of withoutDefs.matchAll(/<line\b[^>]*>/g))
    connectors.push([
      [num(tag, 'x1'), num(tag, 'y1')],
      [num(tag, 'x2'), num(tag, 'y2')],
    ])
  for (const [tag] of withoutDefs.matchAll(/<(?:polyline|polygon)\b[^>]*>/g)) {
    const values = (attr(tag, 'points') ?? '')
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number)
    const points: Point[] = []
    for (let k = 0; k + 1 < values.length; k += 2) points.push([values[k]!, values[k + 1]!])
    if (points.length > 1) connectors.push(points)
  }
  for (const [tag] of withoutDefs.matchAll(/<path\b[^>]*>/g)) {
    const className = attr(tag, 'class') ?? ''
    if (!/\bd-line/.test(className)) continue // dolgu şekilleri değil, yalnızca çizgiler
    connectors.push(...samplePath(attr(tag, 'd') ?? ''))
  }
  return connectors
}

function segmentHitsBox(a: Point, b: Point, box: Box) {
  // Liang–Barsky kırpma
  let t0 = 0
  let t1 = 1
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const checks: [number, number][] = [
    [-dx, a[0] - box.x1],
    [dx, box.x2 - a[0]],
    [-dy, a[1] - box.y1],
    [dy, box.y2 - a[1]],
  ]
  for (const [p, q] of checks) {
    if (p === 0) {
      if (q < 0) return false
    } else {
      const r = q / p
      if (p < 0) t0 = Math.max(t0, r)
      else t1 = Math.min(t1, r)
      if (t0 > t1) return false
    }
  }
  return true
}

function shrink(box: Box, by: number): Box {
  return { x1: box.x1 + by, y1: box.y1 + by, x2: box.x2 - by, y2: box.y2 - by }
}

function contains(outer: Box, inner: Box, slack = 0) {
  return (
    inner.x1 >= outer.x1 - slack &&
    inner.x2 <= outer.x2 + slack &&
    inner.y1 >= outer.y1 - slack &&
    inner.y2 <= outer.y2 + slack
  )
}

function overlaps(a: Box, b: Box) {
  return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2
}

const short = (text: string) => (text.length > 28 ? `${text.slice(0, 27)}…` : text)

/** Yerleşim sorunlarını döndürür (boş dizi = temiz). */
export function lintDiagramLayout(source: string): string[] {
  const svg = source.replace(/<!--[\s\S]*?-->/g, '')
  const problems: string[] = []
  const viewBox = /viewBox\s*=\s*"([^"]+)"/
    .exec(svg)?.[1]
    ?.split(/[\s,]+/)
    .map(Number)
  if (!viewBox || viewBox.length !== 4) return ['viewBox okunamadı']
  const [vx, vy, vw, vh] = viewBox as [number, number, number, number]
  const canvas: Box = { x1: vx, y1: vy, x2: vx + vw, y2: vy + vh }
  const texts = parseTexts(svg)
  const rects = parseRects(svg).filter((r) => !(r.x2 - r.x1 >= vw - 1 && r.y2 - r.y1 >= vh - 1))
  const boxes = rects.filter((r) => !/\bd-lane\b/.test(r.className))
  const connectors = parseConnectors(svg)

  for (const text of texts) {
    if (!contains(canvas, text, 1))
      problems.push(`"${short(text.content)}" çizim alanının (viewBox) dışına taşıyor`)
    const host = boxes
      .filter(
        (r) =>
          text.anchorX > r.x1 && text.anchorX < r.x2 && text.anchorY > r.y1 && text.anchorY < r.y2,
      )
      .sort((a, b) => (a.x2 - a.x1) * (a.y2 - a.y1) - (b.x2 - b.x1) * (b.y2 - b.y1))[0]
    if (host && (text.x1 < host.x1 + 8 || text.x2 > host.x2 - 8))
      problems.push(
        `"${short(text.content)}" kutusundan taşıyor (tahmini genişlik ${Math.round(text.x2 - text.x1)}, kutu ${Math.round(host.x2 - host.x1)})`,
      )
    if (!host) {
      const touched = boxes.find((r) => overlaps(shrink(text, 1), r))
      if (touched) problems.push(`"${short(text.content)}" bir kutunun kenarına biniyor`)
    }
    const hitBox = shrink({ x1: text.x1, y1: text.y1, x2: text.x2, y2: text.y2 }, 1.5)
    if (
      connectors.some((points) =>
        points.slice(1).some((p, k) => segmentHitsBox(points[k]!, p, hitBox)),
      )
    )
      problems.push(`bir çizgi "${short(text.content)}" metninin üstünden geçiyor`)
  }

  for (let a = 0; a < texts.length; a++)
    for (let b = a + 1; b < texts.length; b++)
      if (overlaps(shrink(texts[a]!, 1), shrink(texts[b]!, 1)))
        problems.push(
          `"${short(texts[a]!.content)}" ile "${short(texts[b]!.content)}" üst üste biniyor`,
        )

  for (const box of boxes) {
    const inner = shrink(box, 6)
    if (inner.x2 <= inner.x1 || inner.y2 <= inner.y1) continue
    const label = texts.find(
      (t) => t.anchorX > box.x1 && t.anchorX < box.x2 && t.anchorY > box.y1 && t.anchorY < box.y2,
    )
    if (
      connectors.some((points) =>
        points.slice(1).some((p, k) => segmentHitsBox(points[k]!, p, inner)),
      )
    )
      problems.push(
        `bir çizgi ${label ? `"${short(label.content)}" kutusunun` : 'bir kutunun'} içinden geçiyor`,
      )
  }

  for (let a = 0; a < boxes.length; a++)
    for (let b = a + 1; b < boxes.length; b++) {
      const [ra, rb] = [boxes[a]!, boxes[b]!]
      if (overlaps(shrink(ra, 1), shrink(rb, 1)) && !contains(ra, rb) && !contains(rb, ra))
        problems.push('iki kutu kısmen üst üste biniyor')
    }
  return [...new Set(problems)]
}

/** Platform CSS'inde tanımlı `.diagram .d-*` sınıfları. */
export function knownDiagramClasses(css: string): Set<string> {
  return new Set([...css.matchAll(/\.diagram \.(d-[a-z-]+)/g)].map((m) => m[1]!))
}

/** Sözlükte olmayan d-* sınıfları: stil almaz, öğe görünmez ya da siyah çizilir. */
export function unknownDiagramClasses(source: string, known: Set<string>): string[] {
  const unknown = new Set<string>()
  for (const [, value] of source.matchAll(/class="([^"]+)"/g))
    for (const name of value!.split(/\s+/))
      if (name.startsWith('d-') && !known.has(name)) unknown.add(name)
  return [...unknown].map((name) => `tanımsız diyagram sınıfı: ${name} (rehber §2.4 sözlüğüne bak)`)
}
