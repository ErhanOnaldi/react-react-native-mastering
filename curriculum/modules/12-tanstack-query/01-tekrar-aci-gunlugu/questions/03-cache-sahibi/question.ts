import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Favori ile TMDB cevabının sahibi',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'query.useQuery'],
  question:
    'Sinema’da kullanıcı bir filmi favoriliyor; TMDB’den gelen detay puanı ise zamanla değişebilir. Sayfa tekrar açıldığında güncel puan alınabilsin, favori seçimi korunabilsin. Hangi sahiplik planı bu iki davranışı destekler?',
  options: [
    {
      text: 'TMDB detayı TanStack Query cache’inde, favori seçimi client state’te kalır.',
      correct: true,
      explanation:
        'Sunucu cevabı yeniden alınabilir; favori ise kullanıcının seçimi olduğu için ayrı tutulur.',
    },
    {
      text: 'TMDB detayını `useState` içinde, favoriyi Query cache’inde tut.',
      correct: false,
      explanation:
        'Bu seçim sahipleri tersine çevirir: API cevabını tekrar kullanmak, kullanıcı tercihini de sunucu cache’ine koymayı gerektirmez.',
    },
    {
      text: 'İkisini de Query cache’ine koy; favori seçimini her refetch’te TMDB’den getir.',
      correct: false,
      explanation:
        'TMDB kullanıcının yerel favori seçimini yönetmez; refetch bu tercihi geri vermez.',
    },
  ],
})
