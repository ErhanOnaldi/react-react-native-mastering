import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'TanStack Query — mutation ve ileri',
  phase: 4,
  summary:
    'Sinema’da film puanlamasını gerçek TMDB isteğiyle kurar; cache tutarlılığını, optimistic güncellemeyi ve route yüklemesini yönetirsin.',
  pain: `:::pain[Problem]
Dövüş Kulübü’ne 8,5 verdin; önce yalnız ekrandaki state değişti, TMDB’ye hiçbir şey yazılmadı. Gerçek POST isteğini ekleyince 201 döndü ama “Puanladıklarım” yine boş kaldı; sayfayı yenileyince film göründü. Sunucudaki değişiklik ile ekrandaki cache birbirinden koptu. Her aşamada bu görünür sorunun gereken parçasını düzelteceksin.
:::`,
  outcomes: [
    'Guest session ile yetkili puanlama ve silme isteği gönderebilirsin',
    'Mutation durumlarını kullanıcıya gösterebilirsin',
    'Eski kalan query’yi invalidation veya setQueryData ile güncelleyebilirsin',
    'Optimistic güncellemede başarısız isteği geri alabilirsin',
    'Suspense ve ErrorBoundary ile detay sayfasını kurabilirsin',
    'Router loader içinde ensureQueryData ile ön yükleme yapabilirsin',
  ],
})
