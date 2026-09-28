export interface RequestOptions {
  method?: string
  headers?: Record<string, string>
}

export function needsPreflight(options?: RequestOptions): boolean {
  void options
  return false
}
