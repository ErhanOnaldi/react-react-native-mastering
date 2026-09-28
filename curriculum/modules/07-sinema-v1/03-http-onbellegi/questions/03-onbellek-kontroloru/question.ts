import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Cache-Control yönergelerini ayrıştır ve tazeliği kontrol et',
  difficulty: 'orta',
  concepts: ['web.http-cache', 'ts.functions', 'ts.object-types'],
  files: ['cacheControl.ts'],
  hints: [
    'Başlık metnini virgülle ayırıp trim ettikten sonra küçük harfe çevirerek yönergeleri tek tek incele.',
    'max-age=N veya s-maxage=N gibi değer içeren yönergeleri eşittir karakterinden bölüp sayıya çevir (Number veya parseInt).',
    'Tazelik kontrolünde noStore veya noCache bayrakları varsa doğrudan false dön; maxAge tanımlıysa ageSeconds < maxAge koşulunu test et.',
  ],
})
