// Monaco editörü için tip tanımlarını toplar: giriş paketlerinden başlayıp .d.ts dosyalarının
// import zincirini izler ve her dosyayı `file:///node_modules/<paket>/<yol>` sanal yoluna koyar.
// Monaco yalnızca eski usul package.json "types" alanını okuduğu için (exports'u değil),
// her paket ve alt yol için sentetik bir package.json üretilir.
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs'
import path from 'node:path'

export interface EditorLib {
  path: string
  content: string
}

/** Öğrencinin kodunun ve testlerinin import edebileceği modüller. */
const ENTRY_SPECIFIERS = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  'react-router',
  'react-router/dom',
  '@tanstack/react-query',
  'react-hook-form',
  '@hookform/resolvers/zod',
  'zod',
  '@reduxjs/toolkit',
  'react-redux',
  'clsx',
  'tailwind-merge',
  'class-variance-authority',
  'vitest',
  '@testing-library/react',
  '@testing-library/user-event',
  '@testing-library/jest-dom/vitest',
  'msw',
  'msw/node',
  'msw/browser',
]

/** Çok büyük ve öğrenci kodu için gereksiz paketler: çözümlenmez (Monaco'da `any` olur). */
const SKIP_PACKAGES = new Set([
  'vite',
  'rollup',
  'rolldown',
  'esbuild',
  'postcss',
  'lightningcss',
  '@types/node',
  'undici-types',
  'typescript',
  'jsdom',
  'happy-dom',
  '@vitest/browser',
  '@vitest/mocker',
  'vite-node',
  'tinybench',
  '@vitest/ui',
  'playwright',
  'webdriverio',
  'graphql',
])

const MAX_TOTAL_BYTES = 12 * 1024 * 1024

interface PackageInfo {
  name: string
  dir: string
  json: Record<string, unknown>
}

function packageNameOf(specifier: string) {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!
}

/** Paketin kendisi ve @types karşılığı: tip dosyası çözülen ilk aday kullanılır. */
function findPackageCandidates(name: string, fromDir: string): PackageInfo[] {
  const typesName = `@types/${name.replace('@', '').replace('/', '__')}`
  let dir = fromDir
  for (;;) {
    const found: PackageInfo[] = []
    for (const candidate of [name, typesName]) {
      const pkgDir = path.join(dir, 'node_modules', candidate)
      const pkgJson = path.join(pkgDir, 'package.json')
      if (existsSync(pkgJson)) {
        const json = JSON.parse(readFileSync(pkgJson, 'utf8')) as Record<string, unknown>
        found.push({ name: candidate, dir: realpathSync(pkgDir), json })
      }
    }
    if (found.length > 0) return found
    const parent = path.dirname(dir)
    if (parent === dir) return []
    dir = parent
  }
}

/** exports alanından tip dosyasını seçer (types > import.types > default …). */
function pickTypes(target: unknown): string | undefined {
  if (typeof target === 'string') return /\.d\.[mc]?ts$/.test(target) ? target : undefined
  if (Array.isArray(target)) {
    for (const t of target) {
      const found = pickTypes(t)
      if (found) return found
    }
    return undefined
  }
  if (target && typeof target === 'object') {
    const record = target as Record<string, unknown>
    for (const key of ['types', 'import', 'module', 'default', 'require', 'node', 'browser']) {
      if (key in record) {
        const found = pickTypes(record[key])
        if (found) return found
      }
    }
  }
  return undefined
}

function fileExists(file: string) {
  return existsSync(file) && statSync(file).isFile()
}

function resolveTypesEntry(pkg: PackageInfo, subpath: string): string | undefined {
  const exportsField = pkg.json.exports
  if (exportsField && typeof exportsField === 'object' && !Array.isArray(exportsField)) {
    const exportsMap = exportsField as Record<string, unknown>
    const key = subpath ? `./${subpath}` : '.'
    const hasSubpathKeys = Object.keys(exportsMap).some((k) => k.startsWith('.'))
    const target = hasSubpathKeys ? exportsMap[key] : subpath ? undefined : exportsMap
    const picked = pickTypes(target)
    if (picked) return path.join(pkg.dir, picked)
  }
  if (!subpath) {
    const field = (pkg.json.types ?? pkg.json.typings) as string | undefined
    if (field) return withDtsExtension(path.join(pkg.dir, field))
    return withDtsExtension(path.join(pkg.dir, 'index'))
  }
  return withDtsExtension(path.join(pkg.dir, subpath))
}

function withDtsExtension(base: string): string | undefined {
  const stripped = base.replace(/\.(m|c)?js$/, '')
  const candidates = [
    base,
    `${stripped}.d.ts`,
    `${stripped}.d.mts`,
    `${stripped}.d.cts`,
    path.join(base, 'index.d.ts'),
    path.join(base, 'index.d.mts'),
  ]
  if (base.endsWith('.mjs')) candidates.unshift(`${stripped}.d.mts`)
  if (base.endsWith('.cjs')) candidates.unshift(`${stripped}.d.cts`)
  return candidates.find((c) => /\.d\.[mc]?ts$/.test(c) && fileExists(c))
}

const SPECIFIER_PATTERNS = [
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g,
  /import\(\s*['"]([^'"]+)['"]\s*\)/g,
  /require\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\/\/\/\s*<reference\s+types=["']([^"']+)["']/g,
  /\/\/\/\s*<reference\s+path=["']([^"']+)["']/g,
]

function specifiersOf(source: string) {
  const found = new Set<string>()
  for (const pattern of SPECIFIER_PATTERNS) {
    for (const match of source.matchAll(pattern)) found.add(match[1]!)
  }
  return found
}

export function collectEditorTypes(repoRoot: string, extra: EditorLib[] = []): EditorLib[] {
  const libs = new Map<string, EditorLib>()
  const packages = new Map<string, { info: PackageInfo; entries: Map<string, string> }>()
  const queue: string[] = []
  const seen = new Set<string>()
  let total = 0

  const virtualPath = (pkg: PackageInfo, file: string) =>
    `file:///node_modules/${pkg.name}/${path.relative(pkg.dir, file).split(path.sep).join('/')}`

  const ownerOf = (file: string) => {
    for (const { info } of packages.values()) if (file.startsWith(info.dir + path.sep)) return info
    return undefined
  }

  const addFile = (file: string, pkg: PackageInfo) => {
    if (seen.has(file)) return
    seen.add(file)
    const content = readFileSync(file, 'utf8')
    total += content.length
    if (total > MAX_TOTAL_BYTES) return
    libs.set(virtualPath(pkg, file), { path: virtualPath(pkg, file), content })
    queue.push(file)
  }

  const resolveBare = (specifier: string, fromDir: string) => {
    const name = packageNameOf(specifier)
    if (SKIP_PACKAGES.has(name) || name.startsWith('node:')) return
    const subpath = specifier.slice(name.length + 1)
    let info: PackageInfo | undefined
    let entry: string | undefined
    for (const candidate of findPackageCandidates(name, fromDir)) {
      entry = resolveTypesEntry(candidate, subpath)
      if (entry) {
        info = candidate
        break
      }
    }
    if (!info || !entry || SKIP_PACKAGES.has(info.name)) return
    const record = packages.get(info.name) ?? { info, entries: new Map<string, string>() }
    record.entries.set(subpath, entry)
    packages.set(info.name, record)
    addFile(entry, info)
  }

  for (const specifier of ENTRY_SPECIFIERS) resolveBare(specifier, repoRoot)

  while (queue.length > 0) {
    const file = queue.shift()!
    const owner = ownerOf(file)
    if (!owner) continue
    for (const specifier of specifiersOf(readFileSync(file, 'utf8'))) {
      if (specifier.startsWith('.') || specifier.startsWith('/')) {
        const resolved = withDtsExtension(path.resolve(path.dirname(file), specifier))
        if (resolved && resolved.startsWith(owner.dir)) addFile(resolved, owner)
      } else {
        resolveBare(specifier, path.dirname(file))
      }
    }
  }

  // Sentetik package.json'lar: kök ve alt yollar için "types" alanı
  for (const { info, entries } of packages.values()) {
    for (const [subpath, entry] of entries) {
      const dir = subpath ? path.join(info.dir, subpath) : info.dir
      const types = path.relative(dir, entry).split(path.sep).join('/')
      const pkgPath = `file:///node_modules/${info.name}/${subpath ? `${subpath}/` : ''}package.json`
      libs.set(pkgPath, {
        path: pkgPath,
        content: JSON.stringify({ name: subpath ? `${info.name}/${subpath}` : info.name, types }),
      })
    }
  }

  for (const lib of extra) libs.set(lib.path, lib)
  return [...libs.values()]
}
