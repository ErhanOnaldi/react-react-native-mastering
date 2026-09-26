import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'
import { loadConfigFromFile, type Plugin, type PluginOption } from 'vite'
import { describe, expect, it } from 'vitest'
import { exists, inProject, read, root } from './project-tools'

/** tsconfig.json → referans verdiği config'ler: src/main.tsx'i derleyen hangisi? */
function appTsconfig() {
  const host: ts.ParseConfigFileHost = {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: () => undefined,
  }
  const queue = [inProject('tsconfig.json')]
  const seen = new Set<string>()
  while (queue.length > 0) {
    const file = queue.shift()!
    if (seen.has(file)) continue
    seen.add(file)
    const parsed = ts.getParsedCommandLineOfConfigFile(file, {}, host)
    if (!parsed) continue
    if (parsed.fileNames.includes(inProject('src', 'main.tsx'))) return parsed
    for (const ref of parsed.projectReferences ?? []) {
      queue.push(ts.sys.fileExists(ref.path) ? ref.path : join(ref.path, 'tsconfig.json'))
    }
  }
  return undefined
}

async function viteConfig() {
  const loaded = await loadConfigFromFile(
    { command: 'serve', mode: 'development' },
    undefined,
    root,
  )
  return loaded?.config
}

function pluginNames(plugins: PluginOption[] | undefined): string[] {
  return (plugins ?? [])
    .flat(Infinity as 1)
    .flatMap((p) => (p && typeof p === 'object' && 'name' in p ? [(p as Plugin).name] : []))
}

function aliasTarget(alias: unknown, find: string): string | undefined {
  if (Array.isArray(alias)) {
    return (alias as { find: string | RegExp; replacement: string }[]).find((a) => a.find === find)
      ?.replacement
  }
  return (alias as Record<string, string> | undefined)?.[find]
}

describe('TypeScript', () => {
  it('tsconfig.json var ve src/main.tsx’i derleyen bir uygulama config’ine ulaşıyor', () => {
    expect(exists('tsconfig.json')).toBe(true)
    expect(exists('src', 'main.tsx')).toBe(true)
    expect(appTsconfig(), 'src/main.tsx hiçbir tsconfig tarafından derlenmiyor').toBeDefined()
  })

  it('uygulama config’i strict ve JSX’i react-jsx ile derler', () => {
    const { options } = appTsconfig()!
    expect(options.strict).not.toBe(false)
    expect(options.jsx).toBe(ts.JsxEmit.ReactJSX)
  })

  it('"@/*" yolu "./src/*" klasörünü gösterir (tsconfig paths)', () => {
    const { options } = appTsconfig()!
    expect(options.paths?.['@/*']?.map((p) => p.replace(/^\.\//, ''))).toEqual(['src/*'])
  })
})

describe('Vite', () => {
  it('vite.config.ts React ve Tailwind eklentilerini yükler', async () => {
    const config = await viteConfig()
    const names = pluginNames(config?.plugins)
    expect(
      names.some((n) => n.startsWith('vite:react')),
      `eklentiler: ${names.join(', ')}`,
    ).toBe(true)
    expect(
      names.some((n) => n.includes('tailwindcss')),
      `eklentiler: ${names.join(', ')}`,
    ).toBe(true)
  })

  it('"@" takma adı src klasörüne çözülür (resolve.alias)', async () => {
    const config = await viteConfig()
    const target = aliasTarget(config?.resolve?.alias, '@')
    expect(target && join(target)).toBe(join(root, 'src'))
  })

  it('index.html Türkçe (lang="tr") ve sekme başlığı "Kitaplık"', () => {
    const html = read('index.html')
    expect(html).toMatch(/<html[^>]*\blang="tr"/)
    expect(html).toMatch(/<title>\s*Kitaplık\s*<\/title>/)
  })
})

describe('Tailwind CSS v4', () => {
  it('main.tsx’in import ettiği CSS dosyası @import "tailwindcss" ile başlar', () => {
    const main = read('src', 'main.tsx')
    const cssImport = /import\s+['"]([^'"]+\.css)['"]/.exec(main)?.[1]
    expect(cssImport, 'main.tsx bir .css dosyası import etmeli').toBeDefined()
    const file = cssImport!.startsWith('@/')
      ? inProject('src', cssImport!.slice(2))
      : join(inProject('src'), cssImport!)
    expect(readFileSync(file, 'utf8')).toMatch(/@import\s+['"]tailwindcss['"]/)
  })

  it('v3 kalıntısı yok: @tailwind direktifi ve tailwind.config.js kullanılmıyor', () => {
    const css = readdirSync(inProject('src'), { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.css'))
      .map((f) => read('src', f))
      .join('\n')
    expect(css).not.toMatch(/@tailwind\s+(base|components|utilities)/)
    expect(exists('tailwind.config.js') || exists('tailwind.config.ts')).toBe(false)
  })
})
