import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Şemadan yeni liste girdisi türet',
  difficulty: 'orta',
  concepts: ['zod.schema-composition', 'ts.omit', 'zod.infer'],
  files: ['schemas.ts'],
  hints: [
    'Tam kayıt ile form girdisi arasındaki sistem alanlarını ayır.',
    'Tam şemadan `.omit({ id: true, createdAt: true })`, `.pick({ name: true })` ve `.extend(...)` türet.',
    '`shareUrl` için üst düzey `z.url()` kullan; `name` kuralını yalnızca temel şemada tanımla.',
  ],
})
