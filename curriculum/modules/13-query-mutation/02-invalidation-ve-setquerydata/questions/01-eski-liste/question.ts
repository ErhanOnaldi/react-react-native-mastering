import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: '201 sonrası liste',
  difficulty: 'kolay',
  concepts: ['query.invalidation', 'query.keys'],
  question:
    "POST başarılı oldu. Açık `Puanladıklarım` ekranı `useQuery({ queryKey: ['ratings', sessionId], ... })` kullanıyor ve eski listeyi gösteriyor. Hangi kod, bu oturumun listesini başarıdan sonra sunucudan yeniden aldırır?",
  options: [
    {
      text: "`onSuccess: () => client.invalidateQueries({ queryKey: ['ratings', sessionId] })`",
      correct: true,
      explanation:
        'Başarı callback’i yalnız aynı session ile başlayan rating sorgularını stale yapar.',
    },
    {
      text: "`onSuccess: () => client.setQueryData(['ratings', sessionId], [])`",
      explanation:
        'Bu işlem listeyi yeniden okumaz; cache’i boş bir diziyle değiştirip kayıtları kaybettirir.',
    },
    {
      text: "`onSuccess: () => client.invalidateQueries({ queryKey: ['ratings'] })`",
      explanation: 'Bu daha geniş key başka oturumların rating listelerini de stale yapar.',
    },
  ],
  explanation:
    'Mutation etkilediği query’yi kendiliğinden bulmaz; ilgili key’i açıkça invalidate et.',
})
