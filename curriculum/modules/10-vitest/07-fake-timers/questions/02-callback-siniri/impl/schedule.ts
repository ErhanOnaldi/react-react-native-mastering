export function schedule(callback: () => void, delay: number): ReturnType<typeof setTimeout> {
  return setTimeout(callback, delay)
}
