import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { checkSvg } from '@rm/content/markdown'
import type { RepoPaths } from '@rm/runner'
import pc from 'picocolors'
import { knownDiagramClasses, lintDiagramLayout, unknownDiagramClasses } from './diagram-lint.ts'

const run = promisify(execFile)

type Theme = 'dark' | 'light'

const FONTS: Record<string, string> = {
  '--font-sans': "'Inter', system-ui, sans-serif",
  '--font-mono': 'Menlo, monospace',
}

function tokens(css: string, theme: Theme): Record<string, string> {
  const block =
    theme === 'dark'
      ? /:root,\s*\[data-theme='dark'\]\s*\{([^}]*)\}/.exec(css)
      : /\[data-theme='light'\]\s*\{([^}]*)\}/.exec(css)
  const result: Record<string, string> = { ...FONTS }
  for (const [, name, value] of (block?.[1] ?? '').matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g))
    result[name!] = value!.trim()
  return result
}

/** Platform CSS'indeki `.diagram .d-*` kurallarını, token'ları çözülmüş tek başına bir stile çevirir. */
function standaloneStyle(css: string, theme: Theme) {
  const vars = tokens(css, theme)
  const resolve = (text: string) =>
    text.replace(/var\((--[a-z0-9-]+)\)/g, (_, name: string) => vars[name] ?? 'currentColor')
  const rules = [...css.matchAll(/\.diagram (\.d-[a-z-]+)\s*\{([^}]*)\}/g)].map(
    ([, selector, body]) => `${selector}{${resolve(body!)}}`,
  )
  const base = `svg{font-family:${FONTS['--font-sans']};font-size:14px;fill:${vars['--fg']}}`
  return { style: base + rules.join(''), background: vars['--surface'] ?? '#fff' }
}

async function listSvgs(target: string): Promise<string[]> {
  if ((await stat(target)).isFile()) return [target]
  const entries = await readdir(target, { recursive: true })
  return entries
    .filter((e) => e.endsWith('.svg'))
    .map((e) => path.join(target, e))
    .sort()
}

/**
 * SVG diyagramlarını platform temasıyla PNG'ye çevirir (macOS qlmanage).
 * Yazar/ajan diyagramı gözle kontrol etsin diye: taşan metin, üst üste binen kutu, okunmayan renk.
 */
export async function previewDiagrams(
  paths: RepoPaths,
  target: string | undefined,
  themeOption: string,
  lintOnly = false,
): Promise<number> {
  if (!target) {
    console.log(
      'Kullanım: pnpm preview:diagram <svg dosyası ya da klasör> [--theme dark|light|both] [--lint-only]',
    )
    return 1
  }
  const absolute = path.resolve(target)
  if (!existsSync(absolute)) {
    console.log(pc.red(`Bulunamadı: ${target}`))
    return 1
  }
  const themes: Theme[] =
    themeOption === 'dark' || themeOption === 'light' ? [themeOption] : ['dark', 'light']
  const css = await readFile(
    path.join(paths.repoRoot, 'apps', 'platform', 'src', 'styles', 'index.css'),
    'utf8',
  )
  const outDir = path.join(paths.cacheDir, 'diagram-preview')
  await mkdir(outDir, { recursive: true })
  let failed = 0
  let pngAvailable = !lintOnly
  for (const file of await listSvgs(absolute)) {
    const source = await readFile(file, 'utf8')
    const relative = path.relative(paths.repoRoot, file)
    const problems = checkSvg(source)
    const name = relative.replaceAll(path.sep, '__').replace(/\.svg$/, '')
    if (problems.length) {
      failed += 1
      console.log(`${pc.red('✗')} ${relative}: ${problems.join('; ')}`)
      continue
    }
    const layout = [
      ...unknownDiagramClasses(source, knownDiagramClasses(css)),
      ...lintDiagramLayout(source),
    ]
    if (layout.length) {
      failed += 1
      console.log(`${pc.yellow('⚠')} ${relative}: yerleşim sorunları`)
      for (const problem of layout) console.log(`    - ${problem}`)
    } else console.log(`${pc.green('✓')} ${relative}: yerleşim denetimi temiz`)
    if (!pngAvailable) continue
    for (const theme of themes) {
      const { style, background } = standaloneStyle(css, theme)
      let svg = source.replace(/<\?xml[\s\S]*?\?>/g, '').trim()
      if (!/^<svg\b[^>]*\bxmlns=/.test(svg))
        svg = svg.replace(/^<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"')
      const box =
        /viewBox\s*=\s*"([^"]+)"/
          .exec(svg)?.[1]
          ?.split(/[\s,]+/)
          .map(Number) ?? []
      const [x = 0, y = 0, w = 0, h = 0] = box
      svg = svg.replace(
        /^(<svg\b[^>]*>)/,
        `$1<style>${style}</style><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${background}"/>`,
      )
      const svgOut = path.join(outDir, `${name}.${theme}.svg`)
      await writeFile(svgOut, svg)
      try {
        await run('qlmanage', ['-t', '-s', '1400', '-o', outDir, svgOut])
        const png = path.join(outDir, `${name}.${theme}.png`)
        await rename(`${svgOut}.png`, png)
        console.log(`    ${pc.dim('PNG:')} ${path.relative(paths.repoRoot, png)}`)
      } catch (error) {
        pngAvailable = false
        console.log(
          pc.dim(
            `    PNG üretilemedi (qlmanage bu ortamda çalışmıyor: ${(error as Error).message.split('\n')[0]}). Yerleşim denetimi yine de geçerli.`,
          ),
        )
        break
      }
    }
  }
  return failed ? 1 : 0
}
