import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Guest session ile gerçek POST',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'fetch.headers-auth', 'fetch.error-handling'],
  files: ['ratingApi.ts'],
  hints: [
    'İki isteğin hangi ortak bilgiyi kullandığını ve sonraki çağrıda neyin yeniden kullanılacağını belirle.',
    '`localStorage`, `fetch`, `URLSearchParams` ve `response.ok` ile session ve puan akışını kur.',
    'Önce session anahtarını oku; yoksa GET edip yaz. Ardından POST gövdesine `JSON.stringify({ value })` koy ve iki cevapta da `ok` kontrol et.',
    'Geçersiz yarım adım POST’a ulaşmamalı; session id query parametresini encode et.',
  ],
})
