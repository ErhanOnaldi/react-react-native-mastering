import path from 'node:path'
import { parseArgs } from 'node:util'
import { DEFAULT_REPO_ROOT, resolvePaths } from '@rm/runner'
import pc from 'picocolors'
import { check } from './check.ts'
import { checkpoint, setupProjects } from './checkpoint.ts'
import { previewDiagrams } from './diagram.ts'
import { validate } from './validate.ts'

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    watch: { type: 'boolean', short: 'w', default: false },
    module: { type: 'string', short: 'm' },
    'skip-runs': { type: 'boolean', default: false },
    'skip-projects': { type: 'boolean', default: false },
    'strict-concepts': { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '4' },
    curriculum: { type: 'string' },
    theme: { type: 'string', default: 'both' },
    'lint-only': { type: 'boolean', default: false },
  },
})

const [command, arg] = positionals
const paths = resolvePaths(
  DEFAULT_REPO_ROOT,
  values.curriculum ? { curriculumRoot: path.resolve(values.curriculum) } : {},
)

let exitCode: number
switch (command) {
  case 'check':
    exitCode = await check(paths, arg, { watch: values.watch })
    break
  case 'checkpoint':
    exitCode = await checkpoint(paths, arg)
    break
  case 'setup':
    exitCode = await setupProjects(paths, arg)
    break
  case 'validate':
    exitCode = await validate(paths, {
      module: values.module === undefined ? undefined : Number(values.module),
      skipRuns: values['skip-runs'],
      skipProjects: values['skip-projects'],
      strictConcepts: values['strict-concepts'],
      concurrency: Number(values.concurrency),
    })
    break
  case 'diagram':
    exitCode = await previewDiagrams(paths, arg, values.theme, values['lint-only'])
    break
  default:
    console.log(`${pc.bold('Kullanım:')}
  pnpm check [kısa-kod] [--watch]    Soruyu terminalde çalıştır (varsayılan: son açılan soru)
  pnpm checkpoint <modül>             Sinema'nın o modül başındaki halini aç
  pnpm setup:projects [proje]         projects/<proje>'yi (varsayılan: sinema) başlangıç iskeletinden oluştur
  pnpm validate:content [-m N]        İçerik doğrulama hattı
      --skip-runs                     Test çalıştırmadan (şema + kod blokları)
      --skip-projects                 Proje görevlerini atla (checkpoint henüz yoksa)
  pnpm preview:diagram <svg|klasör>   Diyagramları platform temasıyla PNG'ye çevir (.cache/diagram-preview)
      --theme dark|light|both
      --lint-only                     PNG üretmeden yalnızca yerleşim denetimi (taşma, çizgi-metin çakışması)`)
    exitCode = command ? 1 : 0
}
process.exit(exitCode)
