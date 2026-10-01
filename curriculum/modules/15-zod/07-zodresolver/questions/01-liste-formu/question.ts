import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İzleme listesi formunu şemaya bağla',
  difficulty: 'orta',
  concepts: ['zod.resolver', 'form.rhf-register', 'form.rhf-errors'],
  files: ['WatchlistForm.tsx'],
  hints: [
    "Bir gönderim hangi durumda durmalı ve geçerli ad callback'e hangi biçimde ulaşmalı?",
    'Kuralı `.trim().min(1, { error: "Ad gerekli" })` ile tanımla; RHF formuna bir resolver bağla.',
    '`zodResolver(schema)` kullan; alan hatasını `role="alert"` ile göster ve doğrulanmış adı callback\'e ver.',
  ],
})
