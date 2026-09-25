import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Spoiler açıklamasını zorunlu kıl',
  difficulty: 'orta',
  concepts: ['zod.refine', 'form.rhf-errors'],
  files: ['review.ts'],
  hints: [
    'Kuralın `body` ile `hasSpoiler` alanlarını birlikte okuduğunu fark et.',
    'Nesne şemasına `.refine` ekle; spoiler kapalıysa koşulu doğrudan geçir.',
    'Spoiler açıksa `body.trim().length >= 10` iste; seçeneklere `path: ["body"]` ve `error` mesajını ekle.',
  ],
})
