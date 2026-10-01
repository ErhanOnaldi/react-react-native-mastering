export function schedule(callback: () => void, delay: number): ReturnType<typeof setTimeout> {
  return setTimeout(callback, Math.max(0, delay - 1))
}
