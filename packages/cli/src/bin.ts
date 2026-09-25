import path from 'node:path'
import { parseArgs } from 'node:util'
import { DEFAULT_REPO_ROOT, resolvePaths } from '@rm/runner'
import pc from 'picocolors'
import { check } from './check.ts'
import { checkpoint, setupProjects } from './checkpoint.ts'
import { validate } from './validate.ts'

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    watch: { type: 'boolean', short: 'w', default: false },
    module: { type: 'string', short: 'm' },
    'skip-runs': { type: 'boolean', default: false },
    'strict-concepts': { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '4' },
    curriculum: { type: 'string' },
  },
})

const [command, arg] = positionals
const paths = resolvePaths(DEFAULT_REPO_ROOT, values.curriculum ? { curriculumRoot: path.resolve(values.curriculum) } : {})

let exitCode: number
switch (command) {
  case 'check':
    exitCode = await check(paths, arg, { watch: values.watch })
    break
  case 'checkpoint':
    exitCode = await checkpoint(paths, arg)
    break
  case 'setup':
    exitCode = await setupProjects(paths)
    break
  case 'validate':
    exitCode = await validate(paths, {
      module: values.module === undefined ? undefined : Number(values.module),
      skipRuns: values['skip-runs'],
      strictConcepts: values['strict-concepts'],
      concurrency: Number(values.concurrency),
    })
    break
  default:
    console.log(`${pc.bold('Kullanım:')}
  pnpm check [kısa-kod] [--watch]    Soruyu terminalde çalıştır (varsayılan: son açılan soru)
  pnpm checkpoint <modül>             Sinema'nın o modül başındaki halini aç
  pnpm setup:projects                 projects/sinema'yı başlangıç iskeletinden oluştur
  pnpm validate:content [-m N]        İçerik doğrulama hattı`)
    exitCode = command ? 1 : 0
}
process.exit(exitCode)
