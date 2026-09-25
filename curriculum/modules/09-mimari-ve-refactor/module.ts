import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Mimari ve refactor',
  phase: 2,
  summary:
    'Sinema v1’i davranışını koruyarak feature yapısına taşır, API erişimini tek yerde toplar ve bileşen sınırlarını netleştirirsin.',
  pain: `Sinema’da bir sayfa 300 satıra ulaştı. Token, TMDB adresi ve hata mesajı beş dosyada tekrar ediyor. API adresi değişince dört sayfayı düzeltmen gerekiyor; birini unutunca yalnızca o ekran bozuluyor. Şimdi çalışan uygulamanın davranışını koruyarak bu değişimin maliyetini azaltacağız.`,
  outcomes: [
    'Server, client, URL ve form state’i ayırıp her biri için uygun yeri seçebilirsin',
    'Feature klasörleri ile shared/ sınırını gerçek dosyalarda kurabilirsin',
    'Tipli tmdbClient ve ApiError ile HTTP hatalarını tek noktada yönetebilirsin',
    'TypeScript 6 ve Vite için @/ alias’ını birlikte ayarlayabilirsin',
    'Tekrarlanan sayfa mantığını custom hook’a taşıyabilirsin',
    'Component API’sinde props, composition ve controlled seçimini açıklayabilirsin',
    'Küçük adımlarla refactor yapıp davranışı testlerle koruyabilirsin',
  ],
})
