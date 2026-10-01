export function schedule(callback: () => void, delay: number): ReturnType<typeof setTimeout> {
  callback()
  return setTimeout(() => {}, delay)
}
