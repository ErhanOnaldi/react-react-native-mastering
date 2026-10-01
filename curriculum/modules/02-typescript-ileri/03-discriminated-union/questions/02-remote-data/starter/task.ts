export type RemoteData<T> = { status: string; data?: T; error?: string }
export function message(state: RemoteData<unknown>): string {
  return ''
}
