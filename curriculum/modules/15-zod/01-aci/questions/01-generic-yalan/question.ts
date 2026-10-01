import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Generic sınırda ne yapar?',
  difficulty: 'kolay',
  concepts: ['ts.generics', 'ts.api-types', 'zod.api-validation'],
  question: `Bu fonksiyon \`title\` alanının string olduğunu doğrular mı?

\`\`\`ts
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return (await response.json()) as T
}
const movie = await getJson<{ title: string }>('/movie/550')
movie.title.toUpperCase()
\`\`\`

Sunucu { title: null } döndürürse ne olur?`,
  options: [
    {
      text: 'Kod derlenir; çağrıda null kalır ve toUpperCase hata verir.',
      correct: true,
      explanation:
        'Doğru. Assertion yalnızca TypeScript’i ikna eder. Sunucu null gönderirse aynı null döner ve metot çağrısı çalışma anında hata verir.',
    },
    {
      text: 'Fetch yanıtı 200 olsa da JSON türü uyuşmadığı için Promise reddedilir.',
      correct: false,
      explanation:
        'Fetch JSON alanlarının biçimini denetlemez; HTTP 200 yanıtı çözümlenir ve assertion hatayı gizler.',
    },
    {
      text: 'TypeScript null değerini çalışma anında boş stringe çevirir.',
      correct: false,
      explanation: 'Generic dönüşüm yapmaz; dönüşüm için gerçek çalışma zamanı kodu gerekir.',
    },
  ],
})
