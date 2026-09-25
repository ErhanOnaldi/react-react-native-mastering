// Öğrenci egzersizlerini çalıştıran Vitest ayarı. Runner, hedefi RM_RUN ortam değişkeniyle iletir.
import { defineConfig, loadConfigFromFile, mergeConfig, type UserConfig } from 'vite'

export interface RunConfigInput {
  /** Test dosyalarının bulunduğu klasör */
  root: string
  include: string[]
  alias: Record<string, string>
  setupFiles: string[]
  outputFile: string
  cacheDir: string
  env: Record<string, string>
  /** Project görevlerinde projenin kendi vite.config'i birleştirilir */
  projectDir?: string
  testTimeout?: number
}

const input = JSON.parse(process.env.RM_RUN ?? '{}') as RunConfigInput

export default defineConfig(async () => {
  let base: UserConfig = {}
  if (input.projectDir) {
    const loaded = await loadConfigFromFile(
      { command: 'serve', mode: 'test' },
      undefined,
      input.projectDir,
    )
    base = loaded?.config ?? {}
  }
  const ours: UserConfig = {
    root: input.root,
    cacheDir: input.cacheDir,
    resolve: {
      alias: Object.entries(input.alias).map(([find, replacement]) => ({ find, replacement })),
    },
    test: {
      include: input.include,
      environment: 'jsdom',
      setupFiles: input.setupFiles,
      env: input.env,
      globals: false,
      watch: false,
      testTimeout: input.testTimeout ?? 5000,
      hookTimeout: 10000,
      reporters: ['json'],
      outputFile: { json: input.outputFile },
    },
  }
  return mergeConfig(base, ours)
})
