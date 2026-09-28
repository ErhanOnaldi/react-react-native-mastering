import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bilinmeyen değerde başlık kontrolü',
  difficulty: 'orta',
  concepts: ['ts.narrowing', 'ts.unknown-any'],
  files: ['safeTitle.ts'],
  hints: [
    'Girdinin sırasıyla nesne olduğunu, `null` olmadığını ve `title` alanının string olduğunu kontrol etmeyi düşün.',
    '`typeof value === "object" && value !== null && "title" in value` kontrolünden sonra alanın tipini `typeof` ile daraltabilirsin.',
    'İskelet: `export function safeTitle(value: unknown): string { if (typeof value === "object" && value !== null && "title" in value && typeof value.title === "string") return value.title; return "Başlık yok"; }`',
    'JavaScript’te `typeof null === "object"` sonucunu verir; bu yüzden `value !== null` kontrolünü asla atlamamalısın.',
  ],
})
