export interface Origin {
  protocol: string
  host: string
  port: string
}

export function isSameOrigin(app: Origin, api: Origin): boolean {
  void app
  void api
  return false
}
