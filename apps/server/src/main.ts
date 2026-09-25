import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { serve } from '@hono/node-server'
import { DEFAULT_REPO_ROOT, resolvePaths } from '@rm/runner'
import { createApp } from './app.ts'
import { EventHub, watchCurriculum, watchWorkspace, WriteTracker } from './events.ts'
import { CurriculumStore } from './store.ts'

const PORT = Number(process.env.RM_SERVER_PORT ?? 4317)
// RM_CURRICULUM / RM_PROJECTS: geliştirme sırasında başka bir müfredatla (örn. fixture) çalıştırmak için
const paths = resolvePaths(DEFAULT_REPO_ROOT, {
  ...(process.env.RM_CURRICULUM ? { curriculumRoot: path.resolve(process.env.RM_CURRICULUM) } : {}),
  ...(process.env.RM_PROJECTS ? { projectsRoot: path.resolve(process.env.RM_PROJECTS) } : {}),
  // RM_STATE_DIR: öğrenci durumunu (workspace, ilerleme, önbellek) başka yere yaz (uçtan uca testler için)
  ...(process.env.RM_STATE_DIR
    ? {
        workspaceRoot: path.resolve(process.env.RM_STATE_DIR, 'workspace'),
        progressFile: path.resolve(process.env.RM_STATE_DIR, 'progress.json'),
        cacheDir: path.resolve(process.env.RM_STATE_DIR, 'cache'),
      }
    : {}),
})
const store = new CurriculumStore(paths.curriculumRoot)
const hub = new EventHub()
const tracker = new WriteTracker()

/** .env'de token tanımlı mı? Değeri okunmaz/iletilmez; yalnızca varlığı kontrol edilir. */
function hasTmdbToken() {
  const file = path.join(paths.repoRoot, '.env')
  if (!existsSync(file)) return false
  return /^VITE_TMDB_TOKEN=\s*\S+/m.test(readFileSync(file, 'utf8'))
}

watchWorkspace(paths.workspaceRoot, hub, tracker)
watchCurriculum(paths.curriculumRoot, async () => {
  const curriculum = await store.reload()
  if (curriculum.errors.length > 0) {
    console.warn(`⚠ İçerikte ${curriculum.errors.length} hata var (pnpm validate:content)`)
  }
  hub.emit({ type: 'curriculum-changed' })
})

const app = createApp({ paths, store, hub, tracker, hasTmdbToken })

const curriculum = await store.get()
// Shiki'yi önceden ısıt: ilk ders sayfası beklemesin
void store.html('```ts\nconst hazir = true\n```')
serve({ fetch: app.fetch, hostname: '127.0.0.1', port: PORT }, (info) => {
  console.log(`▶ React Mastering sunucusu: http://127.0.0.1:${info.port}/api`)
  console.log(
    `  ${curriculum.modules.length} modül yüklendi${curriculum.errors.length ? `, ⚠ ${curriculum.errors.length} içerik hatası` : ''}`,
  )
})
