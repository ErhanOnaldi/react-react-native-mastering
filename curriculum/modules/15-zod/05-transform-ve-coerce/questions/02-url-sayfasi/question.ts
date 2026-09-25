import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL sayfasını ve flag’i oku',
  difficulty: 'orta',
  concepts: ['zod.transform', 'router.search-params', 'fetch.query-params'],
  files: ['filters.ts'],
  hints: [
    'URLSearchParams değerlerinin string ya da null döndüğünü hatırla.',
    'Sayfayı `z.coerce.number().int().min(1)`, flag’i `z.stringbool()` ile güvenli parse et.',
    'Eksik page için `"1"`, eksik flag için `"false"` geçir; başarısız sonuçlarda 1/false döndür.',
  ],
})
