import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Doğrulama sınırı',
  difficulty: 'kolay',
  concepts: ['zod.api-validation', 'arch.api-client'],
  question: `Client HTTP durumunu kontrol ediyor, ardından JSON'u döndürüyor:

\`\`\`ts
if (!response.ok) throw new Error(String(response.status))
const raw: unknown = await response.json()
return raw
\`\`\`

TMDB 200 ile \`{ id: 550, title: null }\` döndürürse bozuk değer Query data olmadan önce hangi değişiklikle durdurulur?`,
  options: [
    {
      text: 'JSON dönüşünden önce endpoint şemasını raw değere uygulayarak.',
      correct: true,
      explanation:
        "Doğru. HTTP kontrolü yalnız durum kodunu inceler; body alanlarının şeklini doğrulamak için JSON'u şemadan geçirmelisin.",
    },
    {
      text: 'HTTP durum kontrolünü bir kez daha yaparak.',
      correct: false,
      explanation: 'İkinci HTTP kontrolü 200 yanıtındaki null başlığı fark etmez.',
    },
    {
      text: '`raw as Movie` dönüşümüyle derleyiciye filmi işaret ederek.',
      correct: false,
      explanation:
        'Assertion yalnızca derleyiciyi ikna eder; JSON verisini incelemez veya değiştirmez.',
    },
  ],
})
