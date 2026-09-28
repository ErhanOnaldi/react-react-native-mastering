export async function sendErrorReport(
  error: unknown,
  endpoint: string,
  context: Record<string, unknown> = {},
): Promise<boolean> {
  const body = JSON.stringify({
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : String(error),
    context,
  })

  try {
    if (navigator.sendBeacon?.(endpoint, new Blob([body], { type: 'application/json' }))) {
      return true
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
    return response.ok
  } catch {
    return false
  }
}
