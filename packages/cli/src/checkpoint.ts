import { existsSync } from 'node:fs'
import path from 'node:path'
import { checkpointBefore, copyProject, listCheckpoints, type RepoPaths } from '@rm/runner'
import pc from 'picocolors'

/** `pnpm checkpoint 12` → Sinema'nın 12. modül başındaki halini projects/sinema@12'ye açar. */
export async function checkpoint(paths: RepoPaths, moduleArg: string | undefined, project = 'sinema') {
  const moduleNumber = Number(moduleArg)
  if (!moduleArg || !Number.isInteger(moduleNumber)) {
    console.error(pc.red('Kullanım: pnpm checkpoint <modül-numarası>   (örn. pnpm checkpoint 12)'))
    const all = await listCheckpoints(paths, project)
    if (all.length) console.log(pc.dim(`Mevcut checkpoint'ler: ${all.map((c) => c.label).join(', ')}`))
    return 1
  }
  const source = await checkpointBefore(paths, project, moduleNumber)
  if (!source) {
    console.error(pc.red(`${moduleNumber}. modülden önceye ait checkpoint bulunamadı.`))
    return 1
  }
  const name = `${project}@${moduleNumber}`
  const dest = path.join(paths.projectsRoot, name)
  if (existsSync(dest)) {
    console.error(pc.red(`${path.relative(paths.repoRoot, dest)} zaten var. Önce silmen gerekiyor.`))
    return 1
  }
  await copyProject(source.dir, dest, { packageName: `${project}-checkpoint-${moduleNumber}` })
  console.log(pc.green(`✓ ${moduleNumber}. modülün başındaki hali açıldı: ${path.relative(paths.repoRoot, dest)}`))
  console.log(pc.dim('  Sonraki adımlar:'))
  console.log(`    pnpm install`)
  console.log(`    ${pc.dim('# Kendi projenle karşılaştır ya da onun yerine kullan:')}`)
  console.log(`    ${pc.dim(`# mv projects/${project} projects/${project}-eski && mv projects/${name} projects/${project}`)}`)
  return 0
}

/** `pnpm setup:projects` → projects/sinema yoksa başlangıç iskeletinden oluşturur. */
export async function setupProjects(paths: RepoPaths, project = 'sinema') {
  const dest = path.join(paths.projectsRoot, project)
  if (existsSync(dest)) {
    console.log(pc.dim(`${path.relative(paths.repoRoot, dest)} zaten var.`))
    return 0
  }
  const start = (await listCheckpoints(paths, project)).find((c) => c.label === 'start')
  if (!start) {
    console.error(pc.red(`checkpoints/${project}/start bulunamadı.`))
    return 1
  }
  await copyProject(start.dir, dest)
  console.log(pc.green(`✓ ${path.relative(paths.repoRoot, dest)} oluşturuldu. Şimdi: pnpm install`))
  return 0
}
