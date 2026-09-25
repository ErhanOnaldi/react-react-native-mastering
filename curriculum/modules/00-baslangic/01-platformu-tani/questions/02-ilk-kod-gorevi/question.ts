import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film puanını biçimlendir',
  difficulty: 'kolay',
  concepts: ['tooling.platform', 'js.string-formatting'],
  files: ['formatVote.ts'],
  hints: [
    'Önce test dosyasını oku: üç farklı durum var.',
    '`sayi.toFixed(1)` bir sayıyı tek ondalıklı **string**e çevirir: `(8).toFixed(1)` → `"8.0"`.',
    '0 durumunu en başta ayrı bir `if` ile ele al.',
  ],
})
