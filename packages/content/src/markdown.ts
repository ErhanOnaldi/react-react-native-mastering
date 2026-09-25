import rehypeShiki from '@shikijs/rehype'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import matter from 'gray-matter'
import type { Root as MdastRoot } from 'mdast'
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
      if ((node.type === 'textDirective' || node.type === 'leafDirective') && parent && index !== undefined) {
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
  .use(rehypeStringify)

/** Markdown → HTML (Shiki ile renklendirilmiş; açık/koyu tema CSS değişkenleriyle). */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown)
  return String(file)
}

/** Frontmatter'ı ayırıp gövdeyi render eder. */
export async function renderMarkdownDocument(source: string) {
  const { content, data } = matter(source)
  return { html: await renderMarkdown(content), data }
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
