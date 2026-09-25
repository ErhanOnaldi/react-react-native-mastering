import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Proje v1: Sinema (saf yöntem)',
  phase: 1,
  summary:
    'Sinema ilk kez gerçek TMDB verisini gösteriyor. Bildiğin Hook’lar ve Router ile çalışan bir sürüm kurup tekrar isteklerin izini sürüyorsun.',
  pain: 'Statik Dövüş Kulübü kartı güzel görünüyor; ama yeni filmler hiç gelmiyor. Gerçek TMDB bağlantısı olmadan Sinema bir demo olarak kalıyor. Bu modülde bağlantıyı bildiğin useEffect, useFetch ve Router araçlarıyla kuracaksın. Sonra Network sekmesindeki tekrar istekleri ve sayfalara yayılan loading/error kodunu bir acı günlüğüne yazacaksın.',
  outcomes: [
    'TMDB Bearer token ve Türkçe dil parametresiyle API isteği kurabilirsin',
    'URLSearchParams ile sayfalama ve filtre parametrelerini güvenle birleştirebilirsin',
    'Trend, arama, detay, tür ve favori ekranlarını canlı veriye bağlayabilirsin',
    'Loading ve hata durumlarını kullanıcıya gösterebilirsin',
    'Tekrar istekleri ve eksik effect bağımlılığını gözlemleyip kaydedebilirsin',
  ],
})
