import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'readConfig’i Zod ile yeniden kur',
  difficulty: 'orta',
  concepts: ['zod.env', 'tooling.env', 'zod.transform'],
  files: ['config.ts'],
  hints: [
    '0. modüldeki readConfig sözleşmesini yeniden oku: hangi değer hata, hangisi varsayılan?',
    'Token için `.trim().min(1)`, sayfa boyutu için `z.coerce.number().int().positive()` kullan.',
    'Token ve başlık şemasını parse et; sayfa boyutunu ayrı safeParse sonucu üzerinden 20 varsayılanına bağla.',
  ],
})
