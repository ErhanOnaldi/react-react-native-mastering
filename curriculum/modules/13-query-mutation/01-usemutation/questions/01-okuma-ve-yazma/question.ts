import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Hangi işlem yazma?',
  difficulty: 'kolay',
  concepts: ['query.useMutation', 'query.useQuery'],
  question: 'Dövüş Kulübü’ne 8,5 puan vermek istiyorsun. Hangi akış sunucuya gerçekten yazar?',
  options: [
    {
      text: 'Sadece `useQuery` cache’ine 8,5 koymak',
      explanation: 'Cache yerel bellektir; TMDB’ye POST gitmez.',
    },
    {
      text: '`useMutation` ile POST göndermek',
      correct: true,
      explanation: 'Mutation yazma isteğini ve pending/error durumlarını yönetir.',
    },
    {
      text: '`staleTime` değerini sıfırlamak',
      explanation: 'Bu, okuma verisinin tazeliğini etkiler; yazma isteği üretmez.',
    },
  ],
  explanation: 'Puanlama için guest session ve yetkili POST gerekir.',
})
