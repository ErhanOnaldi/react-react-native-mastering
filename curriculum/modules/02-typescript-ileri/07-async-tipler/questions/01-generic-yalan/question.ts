import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'getJson yalanı',
  difficulty: 'kolay',
  concepts: ['ts.generics', 'ts.unknown-any', 'ts.api-types'],
  question: '`getJson<Movie>(url)` çağrısı hakkında hangisi doğru?',
  options: [
    {
      text: 'Çağıran Movie beklediğini söyler; JSON çalışma zamanında doğrulanmaz.',
      correct: true,
      explanation: 'Doğru; generic tip iddiası ağ sınırında kanıt değildir.',
    },
    {
      text: '`response.json()` değerinin alanlarını çağrıdaki Movie ile karşılaştırır.',
      explanation:
        'TypeScript tipi JSON içeriğini incelemez; response.json() dış veriyi çalışma zamanında döndürür.',
    },
    {
      text: 'Yanlış şekilli JSON gelirse Promise otomatik reddedilir.',
      explanation:
        'Promise JSON parse edilememeyi reddedebilir; Movie alanlarının doğruluğu ayrı kontrol edilmelidir.',
    },
  ],
})
