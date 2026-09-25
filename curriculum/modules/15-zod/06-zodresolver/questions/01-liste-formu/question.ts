import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İzleme listesi formunu şemaya bağla',
  difficulty: 'orta',
  concepts: ['zod.resolver', 'form.rhf-register', 'form.rhf-errors'],
  files: ['WatchlistForm.tsx'],
  hints: [
    'RHF’nin submit akışını koruyup kuralı tek kaynağa taşı.',
    'Şemada `.trim().min(1, { error: "Ad gerekli" })` kullan ve `zodResolver(schema)` bağla.',
    '`formState.errors.name` mesajını `role="alert"` ile göster; geçerli `v.name` değerini onSave’e ver.',
  ],
})
