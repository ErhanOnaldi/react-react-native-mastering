export interface Origin {
  protocol: string
  host: string
  port: string
}

export function isSameOrigin(app: Origin, api: Origin): boolean {
  return app.protocol === api.protocol && app.host === api.host && app.port === api.port
}
