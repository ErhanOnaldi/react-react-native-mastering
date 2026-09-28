import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { loadCurriculum, type Curriculum } from '@rm/content'
import { renderMarkdown, renderMarkdownDocument, type RenderOptions } from '@rm/content/markdown'

/** Müfredatı bellekte tutar; içerik değişince yeniden yükler. Markdown çıktılarını önbelleğe alır. */
export class CurriculumStore {
  #root: string
  #diagramsDir: string
  #current: Promise<Curriculum>
  #html = new Map<string, Promise<string>>()

  constructor(root: string) {
    this.#root = root
    this.#diagramsDir = path.join(root, 'diagrams')
    this.#current = loadCurriculum(root)
  }

  get(): Promise<Curriculum> {
    return this.#current
  }

  reload() {
    this.#current = loadCurriculum(this.#root)
    this.#html.clear()
    return this.#current
  }

  /** Markdown metnini HTML'e çevirir (içerik hash'iyle önbellekli). */
  html(markdown: string): Promise<string> {
    const key = createHash('sha1').update(markdown).digest('hex')
    let cached = this.#html.get(key)
    if (!cached) {
      cached = renderMarkdown(markdown, { diagramsDir: this.#diagramsDir })
      this.#html.set(key, cached)
    }
    return cached
  }

  /** Markdown dosyasını (frontmatter'ı atarak) HTML'e çevirir. */
  async fileHtml(file: string): Promise<string> {
    const source = await readFile(file, 'utf8')
    const key = `file:${file}:${createHash('sha1').update(source).digest('hex')}`
    let cached = this.#html.get(key)
    if (!cached) {
      const options: RenderOptions = { baseDir: path.dirname(file), diagramsDir: this.#diagramsDir }
      cached = renderMarkdownDocument(source, options).then((d) => d.html)
      this.#html.set(key, cached)
    }
    return cached
  }
}
