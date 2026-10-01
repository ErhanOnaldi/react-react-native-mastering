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
      text: '`toEqual({ page: 2, total_pages: 5 })`',
      correct: false,
      explanation:
        '`toEqual` nesnenin tamamını karşılaştırır; yanıtta yeni alanlar eklenince gereksiz yere kırılır.',
    },
    {
      text: '`toHaveProperty("page", 2)`',
      correct: false,
      explanation: 'Bu yalnız `page` alanını denetler; `total_pages` beklentisi açıkta kalır.',
    },
    {
      text: '`toBe({ page: 2, total_pages: 5 })`',
      correct: false,
      explanation:
        '`toBe` nesnelerde aynı referansı arar; response yeni bir nesne olduğu için alanlar aynı olsa da geçmez.',
    },
  ],
})
