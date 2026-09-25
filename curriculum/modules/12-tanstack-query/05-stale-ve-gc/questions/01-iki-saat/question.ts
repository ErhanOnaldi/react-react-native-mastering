import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'İki ayrı saat',
  difficulty: 'kolay',
  concepts: ['query.stale-gc', 'query.useQuery'],
  question:
    '`staleTime: 60_000`, `gcTime: 300_000`. Son abone ayrıldıktan 30 saniye sonra aynı key açılıyor. Beklenen nedir?',
  options: [
    {
      text: 'Taze cache sonucu kullanılır; varsayılan mount refetch gerekmez',
      correct: true,
      explanation: 'Veri hem cache’de durur hem 60 saniye tazedir.',
    },
    { text: 'Cache 30 saniyede silinir', explanation: 'Silme sınırı gcTime olan 300 saniyedir.' },
    {
      text: 'gcTime dolmadan her mount mutlaka GET başlatır',
      explanation:
        'Tazelik refetch kararını etkiler; gcTime yalnız kullanılmayan girdinin ömrüdür.',
    },
  ],
})
