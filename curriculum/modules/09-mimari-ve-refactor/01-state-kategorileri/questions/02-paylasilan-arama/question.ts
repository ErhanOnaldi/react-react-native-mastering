import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Paylaşılabilir arama',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'router.search-params'],
  question: `Arama alanında kullanıcı henüz göndermediği "Dövüş" taslağını yazıyor. Uygulanan arama "Matrix", sayfa 2; TMDB'den de sonuç listesi geldi. "Matrix'in 2. sayfasını" paylaşılabilir yapan URL neyi taşımalı?`,
  options: [
    {
      text: 'Uygulanmış sorgu ve sayfa: q=Matrix, page=2',
      correct: true,
      explanation:
        'Gönderilmemiş taslak input içindir; URL uygulanmış seçimi taşır. Sonuçlar bu seçimle sunucudan alınır.',
    },
    {
      text: 'Input taslağı ve sonuç listesinin tamamı',
      explanation: 'Taslak henüz uygulanmadı; sonuçlar da URL seçimi değil TMDB cevabıdır.',
    },
    {
      text: 'Yalnız q=Matrix',
      explanation: 'Bu aynı sorguyu açar ama ikinci sayfayı geri kuramaz.',
    },
    {
      text: 'Yalnız sonuç listesindeki film id’leri',
      explanation: 'Bunlar cevabın içeriği; sayfa seçimini yeniden kurmak için q ve page gerekir.',
    },
  ],
})
