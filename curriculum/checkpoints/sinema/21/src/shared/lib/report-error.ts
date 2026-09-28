type ErrorReport = {
  name: string
  message: string
  context: Record<string, unknown>
  release: string
}

/** İstemcinin güvenle paylaşabildiği hata bilgisini yayın uç noktasına yollar. */
export async function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
): Promise<void> {
  const endpoint = import.meta.env.VITE_ERROR_ENDPOINT
  if (!endpoint) {
    console.error(error, context)
    return
  }

  try {
    const report: ErrorReport = {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
      context,
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
    }
    const body = JSON.stringify(report)
    if (
      navigator.sendBeacon?.(
        endpoint,
        new Blob([body], { type: 'application/json' }),
      )
    ) {
      return
    }
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch (sendError) {
    console.error('Hata raporu gönderilemedi', sendError)
  }
}
