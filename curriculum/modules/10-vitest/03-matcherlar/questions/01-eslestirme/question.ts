import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Matcher’ı seç',
  difficulty: 'kolay',
  concepts: ['test.matchers', 'ts.object-types'],
  question:
    'Yeni alanlar eklenebilen TMDB cevabında yalnızca `page: 2` ve `total_pages: 5` alanlarını kontrol etmek istiyorsun. Hangisi uygun?',
  options: [
    {
      text: '`toMatchObject({ page: 2, total_pages: 5 })`',
      correct: true,
      explanation: 'İlgili alanları denetler, cevaptaki ek alanlara izin verir.',
    },
    {
      text: '`toBe({ page: 2, total_pages: 5 })`',
      correct: false,
      explanation:
        '`toBe` nesnelerde referans eşitliği arar; yeni nesne aynı alanlara sahip olsa da farklı referanstır.',
    },
    {
      text: '`toThrow()`',
      correct: false,
      explanation: 'Bu matcher fırlatılan hata içindir; normal response alanlarını karşılaştırmaz.',
    },
  ],
})
