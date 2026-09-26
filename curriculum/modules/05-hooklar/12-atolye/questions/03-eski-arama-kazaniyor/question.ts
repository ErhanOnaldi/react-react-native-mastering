import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Eski arama yeni sonucu eziyor',
  difficulty: 'zor',
  concepts: ['react.race-conditions', 'react.useEffect.cleanup', 'fetch.basics'],
  files: ['MovieSearch.tsx'],
  hints: [
    'İki istek aynı anda sürerken son yazılan sorgunun sonucunu kim belirliyor?',
    'Her sorgu çalışmasının kendi geçerlilik işareti veya iptal sinyali olabilir; yeni sorguda eskisinin yazma hakkını kaldır.',
    'Effect cleanup’ında eski çalışmayı geçersiz kıl; cevap geldiğinde yalnızca hâlâ güncel olan çalışma `setMovies` çağırsın.',
  ],
  preview: { entry: 'Preview.tsx' },
})
