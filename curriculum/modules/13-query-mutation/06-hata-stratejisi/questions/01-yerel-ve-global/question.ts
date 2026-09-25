import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: '500 hatasını duyur',
  difficulty: 'kolay',
  concepts: ['query.useMutation', 'fetch.error-handling'],
  question:
    'Puanlama 500 dönerse hem butonda hata hem genel bildirim gerekiyor. Hangi düzen uygundur?',
  options: [
    {
      text: 'Yerel `isError` ve QueryClient `MutationCache.onError` birlikte.',
      correct: true,
      explanation: 'Yerel UI bağlama özgü mesajı, global callback genel bildirimi verir.',
    },
    {
      text: 'Yalnızca `MutationCache.onError`, butonun durumunu da otomatik yazar.',
      explanation: 'Global callback bileşenin UI’ını kendiliğinden değiştirmez.',
    },
    {
      text: '`fetch` 500 için zaten reject eder; ek kontrol gerekmez.',
      explanation: 'Fetch HTTP hata durumunda response.ok kontrolü olmadan reject etmez.',
    },
  ],
  explanation:
    'Global bildirim log için; yerel error rollback ve düzeltilebilir alan mesajı için uygundur.',
})
