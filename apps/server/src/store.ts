import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { loadCurriculum, type Curriculum } from '@rm/content'
import { renderMarkdown, renderMarkdownDocument } from '@rm/content/markdown'

/** Müfredatı bellekte tutar; içerik değişince yeniden yükler. Markdown çıktılarını önbelleğe alır. */
export class CurriculumStore {
  #root: string
  #current: Promise<Curriculum>
  #html = new Map<string, Promise<string>>()

  constructor(root: string) {
    this.#root = root
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
      cached = renderMarkdown(markdown)
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
      cached = renderMarkdownDocument(source).then((d) => d.html)
      this.#html.set(key, cached)
    }
    return cached
  }
}
