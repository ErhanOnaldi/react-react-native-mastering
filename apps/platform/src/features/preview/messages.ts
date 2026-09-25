/** Önizleme iframe'i → platform mesajları */
export type PreviewMessage =
  | { type: 'request'; count: number; method: string; url: string; at: number }
  | { type: 'halted'; count: number }
  | { type: 'error'; message: string }
  | { type: 'heap'; usedMb: number }
