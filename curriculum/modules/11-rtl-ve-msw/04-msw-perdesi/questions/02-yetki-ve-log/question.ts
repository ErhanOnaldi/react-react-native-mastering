import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '401 yanıtı fetch’i durdurur mu?',
  difficulty: 'kolay',
  concepts: ['test.msw', 'fetch.headers-auth'],
  question:
    'Authorization başlığı olmadan film istediğinde MSW 401 döndürür. `fetch` çağrısının sonucu için hangisi doğrudur?',
  options: [
    {
      text: '`fetch` Response ile tamamlanır; `response.ok` false olur',
      correct: true,
      explanation:
        'HTTP 401 tek başına Promise’i reddetmez. Uygulama `response.ok` değerini kontrol edip hata durumuna geçmelidir.',
    },
    {
      text: '`fetch` Promise’i otomatik olarak reject olur',
      explanation:
        '`fetch` ağ hatasında reject olur; 401 gibi HTTP cevaplarında Response döndürür.',
    },
    {
      text: '`response.json()` çağrısı 401 durumunda hata fırlatır',
      explanation:
        'JSON gövdesi parse edilebilir. Status kontrolü ayrı yapılır; `json()` yalnız gövdeyi okur.',
    },
  ],
})
