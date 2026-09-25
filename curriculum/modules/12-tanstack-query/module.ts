import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'TanStack Query — temeller',
  phase: 4,
  summary:
    'Sinema’nın tekrar eden TMDB isteklerini ölçüp query cache, sayfalama ve prefetch ile yönetirsin.',
  pain: `:::pain[Problem]
Sinema v1’de aramadan detaya gidip geri dönünce aynı GET yeniden atılıyordu. Dört sayfada ayrı loading/error kodu vardı. İstek sayacı 1 → 2 olurken kullanıcı aynı sonucu tekrar bekliyordu. Bu modülde önce bu kaybı ölçüp sonra TanStack Query 5 ile çözeceksin.
:::`,
  outcomes: [
    'Tekrar eden istekleri requests() ve önizleme sayacıyla ölçebilirsin',
    'QueryClientProvider ve useQuery ile yükleme, hata ve başarı durumlarını yönetebilirsin',
    'URL durumundan doğru query key ve queryOptions üretebilirsin',
    'staleTime, gcTime ve bağımlı sorguları doğru seçebilirsin',
    'Sayfalama, sonsuz liste ve hover prefetch akışını kurabilirsin',
    'Query kullanan bileşenleri izole QueryClient ile test edebilirsin',
  ],
})
