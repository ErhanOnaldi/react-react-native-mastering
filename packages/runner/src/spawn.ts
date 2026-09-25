import { spawn } from 'node:child_process'

export interface SpawnResult {
  code: number | null
  output: string
  timedOut: boolean
  durationMs: number
}

/**
 * Komutu kendi süreç grubunda çalıştırır; süre aşılırsa tüm grubu (Vitest worker'ları dahil) öldürür.
 * Böylece öğrencinin sonsuz döngüsü sunucuyu kilitleyemez.
 */
export function run(
  command: string,
  args: string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv; timeoutMs: number },
): Promise<SpawnResult> {
  const started = performance.now()
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1', ...options.env },
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = ''
    let timedOut = false
    const append = (chunk: Buffer) => {
      // Aşırı büyük çıktıları kırp (sonsuz console.log vb.)
      if (output.length < 200_000) output += chunk.toString()
    }
    child.stdout.on('data', append)
    child.stderr.on('data', append)

    const kill = () => {
      try {
        if (child.pid) process.kill(-child.pid, 'SIGKILL')
      } catch {
        // süreç zaten bitmiş
      }
    }
    const timer = setTimeout(() => {
      timedOut = true
      kill()
    }, options.timeoutMs)

    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, output, timedOut, durationMs: Math.round(performance.now() - started) })
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      resolve({
        code: -1,
        output: output + String(error),
        timedOut,
        durationMs: Math.round(performance.now() - started),
      })
    })
  })
}
