import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Favori ile TMDB cevabının sahibi',
  difficulty: 'orta',
  concepts: ['redux.server-vs-client', 'query.useQuery'],
  question:
    'Sinema’da favori yıldızı ve TMDB film detayı var. Modül 16’da Redux da eklenecek. Detayı yenileyince yeni puan gelsin, favori seçimi ise yerel kalsın. Hangi sahiplik planı doğru?',
  options: [
    {
      text: 'TMDB detayı TanStack Query cache’inde, favori seçimi client state/Redux slice’ında kalır.',
      correct: true,
      explanation:
        'Doğru. Sunucudan gelen veri yeniden çekilir ve invalidation görür; kullanıcı tercihi ayrı yaşam döngüsüne sahiptir.',
    },
    {
      text: 'İkisini de Redux’a kopyala; Query invalidation Redux kopyasını otomatik düzeltir.',
      correct: false,
      explanation:
        'Query cache ile Redux store ayrı kaynaklardır; invalidation Redux kopyasını otomatik senkronlamaz.',
    },
    {
      text: 'İkisini de Query cache’ine koy; favori seçimini her refetch’te TMDB’den getir.',
      correct: false,
      explanation:
        'TMDB kullanıcının yerel favori seçimini yönetmez; refetch bu tercihi geri vermez.',
    },
  ],
})
