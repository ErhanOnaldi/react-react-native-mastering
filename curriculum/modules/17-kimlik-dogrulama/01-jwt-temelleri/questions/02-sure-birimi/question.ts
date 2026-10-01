import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'exp saniye mi, milisaniye mi?',
  difficulty: 'orta',
  concepts: ['auth.jwt', 'js.dates'],
  question:
    '`exp = 1_800_000_000` ve `Date.now() = 1_800_000_001_000`. Sinema arayüzü bu JWT süresini geçmiş saymalı mı?',
  options: [
    {
      text: 'Evet; `exp` saniye olduğu için önce 1000 ile çarpıp milisaniyeyle karşılaştırmalısın.',
      correct: true,
      explanation:
        '`exp * 1000` değeri `Date.now()` ile aynı birime gelir ve şimdiki zamandan küçüktür.',
    },
    {
      text: 'Evet; `exp` zaten milisaniyedir, doğrudan `exp <= Date.now()` yazılır.',
      explanation:
        'JWT `exp` saniyedir. Doğrudan kıyaslamak yeni token’ları bile süresi dolmuş gibi gösterir.',
    },
    {
      text: 'Hayır; `exp` ve `Date.now()` aynı türde sayılar olduğu için birim dönüşümü gerekmez.',
      explanation:
        'Sayıların ikisi de number olsa da farklı zaman birimleri taşırlar: saniye ve milisaniye.',
    },
  ],
})
