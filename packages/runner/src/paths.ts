import path from 'node:path'

export interface RepoPaths {
  repoRoot: string
  curriculumRoot: string
  workspaceRoot: string
  projectsRoot: string
  testEnvDir: string
  cacheDir: string
  progressFile: string
}

/** Varsayılan yollar; testlerde fixture'lara yönlendirmek için ezilebilir. */
export function resolvePaths(repoRoot: string, overrides: Partial<RepoPaths> = {}): RepoPaths {
  return {
    repoRoot,
    curriculumRoot: path.join(repoRoot, 'curriculum'),
    workspaceRoot: path.join(repoRoot, 'workspace'),
    projectsRoot: path.join(repoRoot, 'projects'),
    testEnvDir: path.join(repoRoot, 'curriculum', 'test-env'),
    cacheDir: path.join(repoRoot, '.cache'),
    progressFile: path.join(repoRoot, 'progress.json'),
    ...overrides,
  }
}

/** Bu paketin kök dizini (packages/runner) */
export const RUNNER_ROOT = path.resolve(import.meta.dirname, '..')

/** Monorepo kökü (packages/runner/../..) */
export const DEFAULT_REPO_ROOT = path.resolve(RUNNER_ROOT, '../..')
