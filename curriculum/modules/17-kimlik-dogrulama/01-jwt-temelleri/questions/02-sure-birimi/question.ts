import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'exp ile saat karşılaştırması',
  difficulty: 'orta',
  concepts: ['auth.jwt', 'js.dates'],
  question:
    '`exp = 1_800_000_000` ve `Date.now() = 1_800_000_001_000`. Token’ın bildirdiği süre doldu mu?',
  options: [
    {
      text: 'Evet; `exp * 1000 < Date.now()`.',
      correct: true,
      explanation:
        'JWT exp saniye, Date.now milisaniye döner. Aynı birime çevirince süre dolmuştur.',
    },
    {
      text: 'Hayır; 1_800_000_000 sayısı Date.now değerine yakın.',
      explanation:
        'Sayıları birim dönüştürmeden kıyaslamak hatalıdır; aralarında bin kat fark var.',
    },
    {
      text: 'Yalnız access token’ın signature parçasından anlaşılır.',
      explanation:
        'Bitiş zamanı payload’daki exp alanıdır; imza doğruluğunu ise sunucu kontrol eder.',
    },
  ],
})
