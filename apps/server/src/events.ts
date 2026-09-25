import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { watch } from 'chokidar'
import type { ServerEvent } from './dto.ts'

type Listener = (event: ServerEvent) => void

export class EventHub {
  #listeners = new Set<Listener>()

  subscribe(listener: Listener) {
    this.#listeners.add(listener)
    return () => this.#listeners.delete(listener)
  }

  emit(event: ServerEvent) {
    for (const listener of this.#listeners) listener(event)
  }
}

const hash = (content: string) => createHash('sha1').update(content).digest('hex')

/**
 * Sunucunun kendi yazdığı içerikleri hatırlar; dosya izleyicisi bu yazımları "dış değişiklik"
 * sanıp editöre geri göndermesin (yankı bastırma).
 */
export class WriteTracker {
  #written = new Map<string, string>()

  remember(file: string, content: string) {
    this.#written.set(path.resolve(file), hash(content))
  }

  isOwnWrite(file: string, content: string) {
    return this.#written.get(path.resolve(file)) === hash(content)
  }
}

/** workspace/ altındaki değişiklikleri (VS Code'dan düzenleme) platforma bildirir. */
export function watchWorkspace(workspaceRoot: string, hub: EventHub, tracker: WriteTracker) {
  const watcher = watch(workspaceRoot, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 120, pollInterval: 40 },
  })
  const onChange = async (file: string) => {
    const relative = path.relative(workspaceRoot, file).split(path.sep)
    if (relative.length < 4) return // <modül>/<ders>/<soru>/<dosya...>
    const content = await readFile(file, 'utf8').catch(() => undefined)
    if (content === undefined || tracker.isOwnWrite(file, content)) return
    tracker.remember(file, content)
    hub.emit({
      type: 'file-changed',
      questionId: relative.slice(0, 3).join('/'),
      file: relative.slice(3).join('/'),
    })
  }
  watcher.on('add', onChange).on('change', onChange)
  return watcher
}

/** İçerik (curriculum/) değişince müfredatı yeniden yükler. */
export function watchCurriculum(root: string, onChange: () => void) {
  let timer: NodeJS.Timeout | undefined
  const watcher = watch(root, {
    ignoreInitial: true,
    ignored: (p) => p.includes(`${path.sep}checkpoints${path.sep}`),
  })
  watcher.on('all', () => {
    clearTimeout(timer)
    timer = setTimeout(onChange, 200)
  })
  return watcher
}
