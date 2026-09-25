import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Hangi optimistic yol?',
  difficulty: 'kolay',
  concepts: ['query.optimistic', 'query.useMutation'],
  question:
    'Yalnızca tıklanan butonda “8,5 gönderiliyor” göstermek istiyorsun. Hangisi en küçük çözüm?',
  options: [
    {
      text: 'Pending iken `mutation.variables.value` göster.',
      correct: true,
      explanation: 'Tek bileşendeki geçici değer için cache patch’i gerekmez.',
    },
    {
      text: 'Her query key’ini `setQueryData` ile değiştir.',
      explanation: 'Tüm cache’i elle güncellemek gereksiz ve hata risklidir.',
    },
    {
      text: 'POST bitene kadar hiçbir bilgi gösterme.',
      explanation: 'Kullanıcı gecikmede tıklamanın alındığını anlayamaz.',
    },
  ],
  explanation: 'Paylaşılan listede geçici sonucu göstermek gerekirse onMutate ile cache güncelle.',
})
