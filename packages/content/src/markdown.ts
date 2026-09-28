import rehypeShiki from '@shikijs/rehype'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Image, Paragraph, Root as MdastRoot } from 'mdast'
import type {} from 'mdast-util-directive'
import type {} from 'mdast-util-to-hast'
import rehypeStringify from 'rehype-stringify'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { ShikiTransformer } from 'shiki'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

/** Ders metinlerinde kullanılabilen bilgi kutuları: `:::tip[Başlık] ... :::` */
export const CALLOUT_KINDS = {
  tip: 'İpucu',
  warning: 'Dikkat',
  sector: 'Sektörde',
  pain: 'Problem',
  info: 'Not',
  mistake: 'Sık yapılan hata',
  model: 'Zihinsel model',
} as const

type CalloutKind = keyof typeof CALLOUT_KINDS

function isCalloutKind(name: string): name is CalloutKind {
  return Object.hasOwn(CALLOUT_KINDS, name)
}

/**
 * `:::tip` → <aside class="callout" data-kind="tip">.
 * Bilinmeyen text/leaf direktifleri (örn. "Not:önemli" içindeki ":önemli") düz metne geri çevrilir.
 */
function remarkCallouts() {
  return (tree: MdastRoot) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'containerDirective') {
        const kind = isCalloutKind(node.name) ? node.name : 'info'
        const first = node.children[0]
        let title: string = CALLOUT_KINDS[kind]
        if (first && first.type === 'paragraph' && first.data && 'directiveLabel' in first.data) {
          title = first.children.map((c) => ('value' in c ? c.value : '')).join('')
          node.children.shift()
        }
        node.data = {
          hName: 'aside',
          hProperties: { className: ['callout'], 'data-kind': kind, 'data-title': title },
        }
        return
      }
      if (
        (node.type === 'textDirective' || node.type === 'leafDirective') &&
        parent &&
        index !== undefined
      ) {
        const label = node.children.map((c) => ('value' in c ? c.value : '')).join('')
        const text = `${node.type === 'leafDirective' ? '::' : ':'}${node.name}${label ? `[${label}]` : ''}`
        parent.children.splice(index, 1, { type: 'text', value: text })
      }
    })
  }
}

/** ```tsx title="App.tsx" check → data-title / data-lang; "check" bayrağı gösterimde gizlenir. */
function transformerMeta(): ShikiTransformer {
  return {
    name: 'rm:meta',
    pre(node) {
      const raw = this.options.meta?.__raw ?? ''
      const title = /title="([^"]+)"/.exec(raw)?.[1]
      if (title) node.properties['data-title'] = title
      node.properties['data-lang'] = this.options.lang
    },
  }
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkCallouts)
  .use(remarkRehype)
  .use(rehypeShiki, {
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    transformers: [
      transformerMeta(),
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationFocus(),
    ],
  })
  // Markdown içindeki ham HTML remark-rehype'ta zaten atılır; geriye yalnızca
  // inlineDiagrams'ın doğrulayıp eklediği SVG'ler (raw düğüm) kalır.
  .use(rehypeStringify, { allowDangerousHtml: true })

/** Diyagram adreslerinin çözüleceği klasörler. */
export interface RenderOptions {
  /** Göreli `.svg` adreslerinin çözüleceği klasör (dersin ya da sorunun klasörü). */
  baseDir?: string
  /** `diagram:ad` adreslerinin çözüleceği ortak klasör (`curriculum/diagrams`). */
  diagramsDir?: string
}

const DIAGRAM_SCHEME = 'diagram:'

type DiagramTarget =
  { kind: 'none' } | { kind: 'invalid'; reason: string } | { kind: 'diagram'; file: string }

/**
 * `![açıklama](diagram:render-commit)` → ortak klasördeki `render-commit.svg`;
 * `![açıklama](diagrams/akis.svg)` → dersin kendi klasöründeki dosya. Diğer görseller diyagram değildir.
 */
export function resolveDiagram(url: string, options: RenderOptions): DiagramTarget {
  if (url.startsWith(DIAGRAM_SCHEME)) {
    const name = url.slice(DIAGRAM_SCHEME.length)
    if (!/^[a-z0-9-]+$/.test(name))
      return { kind: 'invalid', reason: `Geçersiz diyagram adı: "${name}" (kebab-case olmalı)` }
    if (!options.diagramsDir)
      return { kind: 'invalid', reason: 'Ortak diyagram klasörü bilinmiyor' }
    return { kind: 'diagram', file: path.join(options.diagramsDir, `${name}.svg`) }
  }
  if (!url.toLowerCase().endsWith('.svg') || /^[a-z][a-z0-9+.-]*:|^\//i.test(url))
    return { kind: 'none' }
  if (!options.baseDir) return { kind: 'invalid', reason: `Göreli diyagram çözülemedi: ${url}` }
  const base = path.resolve(options.baseDir)
  const file = path.resolve(base, url)
  if (!file.startsWith(base + path.sep))
    return { kind: 'invalid', reason: `Diyagram kendi klasörünün dışında olamaz: ${url}` }
  return { kind: 'diagram', file }
}

function stripProlog(source: string) {
  return source
    .replace(/^\uFEFF/, '')
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
}

const FORBIDDEN_SVG: [RegExp, string][] = [
  [/<script\b/i, '<script> kullanılamaz'],
  [/<style\b/i, '<style> kullanılamaz (sayfanın stilini bozar); d-* sınıflarını kullan'],
  [/<foreignObject\b/i, '<foreignObject> kullanılamaz'],
  [
    /<(?:image|use|a)\b[^>]*\bhref\s*=\s*["'](?!#)/i,
    'dış bağlantı ya da görsel kullanılamaz (yalnızca #id)',
  ],
  [/\son[a-z]+\s*=/i, 'olay öznitelikleri (onclick…) kullanılamaz'],
  [/javascript:/i, 'javascript: adresi kullanılamaz'],
]

/** SVG dosyasının platformda güvenle satır içine alınabilir olup olmadığını denetler. */
export function checkSvg(source: string): string[] {
  const svg = stripProlog(source)
  const problems: string[] = []
  if (!/^<svg\b[^>]*\bviewBox\s*=/.test(svg))
    problems.push('dosya viewBox içeren bir <svg> ile başlamalı')
  if (!/<\/svg>$/.test(svg)) problems.push('dosya </svg> ile bitmeli')
  for (const [pattern, message] of FORBIDDEN_SVG) if (pattern.test(svg)) problems.push(message)
  return problems
}

function escapeAttribute(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Aynı sayfadaki iki diyagramın id'leri (ok uçları vb.) çakışmasın diye dosyaya özgü önek ekler. */
function prepareSvg(source: string, file: string, label: string) {
  let svg = stripProlog(source)
  const prefix = `d${createHash('sha1').update(file).digest('hex').slice(0, 6)}-`
  const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!))
  for (const id of ids) {
    const escaped = escapeRegExp(id)
    svg = svg
      .replace(new RegExp(`(\\s)id="${escaped}"`, 'g'), `$1id="${prefix}${id}"`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, 'g'), `url(#${prefix}${id})`)
      .replace(new RegExp(`href="#${escaped}"`, 'g'), `href="#${prefix}${id}"`)
  }
  return svg.replace(
    /^<svg\b/,
    `<svg role="img" aria-label="${escapeAttribute(label)}" focusable="false"`,
  )
}

function isLoneImage(paragraph: Paragraph) {
  const meaningful = paragraph.children.filter((c) => !(c.type === 'text' && !c.value.trim()))
  return meaningful.length === 1 && meaningful[0]!.type === 'image'
}

/** Tek başına bir paragraftaki diyagram görsellerini <figure class="diagram"> içinde satır içi SVG yapar. */
function inlineDiagrams(tree: MdastRoot, options: RenderOptions) {
  visit(tree, 'paragraph', (paragraph) => {
    if (!isLoneImage(paragraph)) return
    const image = paragraph.children.find((c): c is Image => c.type === 'image')!
    const target = resolveDiagram(image.url, options)
    if (target.kind === 'none') return
    const label = image.alt?.trim() || 'Diyagram'
    const caption = image.title?.trim() || label
    let reason = target.kind === 'invalid' ? target.reason : undefined
    let svg = ''
    if (target.kind === 'diagram') {
      if (!existsSync(target.file)) reason = `Diyagram bulunamadı: ${path.basename(target.file)}`
      else {
        const source = readFileSync(target.file, 'utf8')
        const problems = checkSvg(source)
        if (problems.length) reason = `${path.basename(target.file)}: ${problems.join('; ')}`
        else svg = prepareSvg(source, target.file, label)
      }
    }
    paragraph.data = reason
      ? {
          hName: 'p',
          hProperties: { className: ['diagram-error'] },
          hChildren: [{ type: 'text', value: `Diyagram gösterilemedi — ${reason}` }],
        }
      : {
          hName: 'figure',
          hProperties: { className: ['diagram'] },
          hChildren: [
            { type: 'raw', value: svg },
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text', value: caption }],
            },
          ],
        }
  })
}

/** Markdown → HTML (Shiki ile renklendirilmiş; açık/koyu tema CSS değişkenleriyle). */
export async function renderMarkdown(
  markdown: string,
  options: RenderOptions = {},
): Promise<string> {
  const tree = processor.parse(markdown)
  inlineDiagrams(tree, options)
  const hast = await processor.run(tree)
  return processor.stringify(hast)
}

/** Frontmatter'ı ayırıp gövdeyi render eder. */
export async function renderMarkdownDocument(source: string, options: RenderOptions = {}) {
  const { content, data } = matter(source)
  return { html: await renderMarkdown(content, options), data }
}

export interface DiagramProblem {
  /** Kaynak dosyadaki satır (1'den başlar) */
  line: number
  message: string
}

/** Doğrulama hattı için: markdown'daki diyagram referanslarını ve SVG dosyalarını denetler. */
export function checkDiagrams(markdown: string, options: RenderOptions): DiagramProblem[] {
  const problems: DiagramProblem[] = []
  const tree = processor.parse(markdown)
  visit(tree, 'image', (image, _index, parent) => {
    const target = resolveDiagram(image.url, options)
    if (target.kind === 'none') return
    const line = image.position?.start.line ?? 0
    if (target.kind === 'invalid') {
      problems.push({ line, message: target.reason })
      return
    }
    if (!image.alt?.trim())
      problems.push({ line, message: 'Diyagramın alt metni (ekran okuyucu açıklaması) boş olamaz' })
    if (parent?.type !== 'paragraph' || !isLoneImage(parent))
      problems.push({ line, message: 'Diyagram tek başına bir paragrafta durmalı' })
    if (!existsSync(target.file)) {
      problems.push({ line, message: `Diyagram bulunamadı: ${target.file}` })
      return
    }
    for (const problem of checkSvg(readFileSync(target.file, 'utf8')))
      problems.push({ line, message: `${path.basename(target.file)}: ${problem}` })
  })
  return problems
}

export interface CheckedCodeBlock {
  lang: string
  code: string
  /** Kaynak dosyadaki satır (1'den başlar) */
  line: number
}

/** ```ts check / ```tsx check işaretli kod bloklarını çıkarır (doğrulama hattı derler). */
export function extractCheckedCodeBlocks(markdown: string): CheckedCodeBlock[] {
  const tree = unified().use(remarkParse).parse(markdown)
  const blocks: CheckedCodeBlock[] = []
  visit(tree, 'code', (node) => {
    if (!node.lang || !['ts', 'tsx'].includes(node.lang)) return
    if (!node.meta || !/(^|\s)check(\s|$)/.test(node.meta)) return
    blocks.push({ lang: node.lang, code: node.value, line: node.position?.start.line ?? 0 })
  })
  return blocks
}
