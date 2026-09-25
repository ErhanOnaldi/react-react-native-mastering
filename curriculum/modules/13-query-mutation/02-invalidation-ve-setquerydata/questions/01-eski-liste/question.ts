import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: '201 sonrası liste',
  difficulty: 'kolay',
  concepts: ['query.invalidation', 'query.keys'],
  question: 'POST 201 döndü, Puanladıklarım listesi yine boş. Neden?',
  options: [
    {
      text: 'Mutation query cache’ini hangi key’in etkilendiğini bilmeden güncellemez.',
      correct: true,
      explanation: 'POST başarısı, liste key’ini otomatik değiştirmez.',
    },
    {
      text: '`staleTime` 0 ise POST listeyi otomatik doldurur.',
      explanation:
        'Stale olmak yazma cevabını listeye dönüştürmez; etkin query yeniden okunmalıdır.',
    },
    {
      text: 'React her render’da cache’i sunucuyla birleştirir.',
      explanation: 'Render cache içeriğini okur; sunucudan kendiliğinden yeni veri üretmez.',
    },
  ],
  explanation:
    'İlgili listeyi invalidation ile yenile veya kesin yeni veriyi setQueryData ile yaz.',
})
