import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Saklanan cevap doğrudan kullanılabilir mi?',
  difficulty: 'kolay',
  concepts: ['web.http-cache', 'ts.functions'],
  files: ['cacheControl.ts'],
  hints: [
    'Önce cevabın doğrudan kullanılamayacağı yönergeleri denetle.',
    'Doğrudan kullanım için maxAge bilgisi bulunmalı ve cevap bu süreden genç olmalı.',
    'noCache veya noStore varsa false dön. Diğer durumda maxAge tanımlıysa ageSeconds değerini onunla karşılaştır.',
  ],
})
