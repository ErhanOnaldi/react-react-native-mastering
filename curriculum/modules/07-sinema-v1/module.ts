import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Proje v1: Sinema (saf yöntem)',
  phase: 1,
  summary:
    'HTTP isteklerini, CORS izinlerini ve tarayıcı önbelleğini okuyup Sinema’yı gerçek TMDB verisine bağlıyorsun. Sonra tekrar eden istekleri ve sayfalara yayılan durum kodunu gözlemliyorsun.',
  pain: 'Statik Dövüş Kulübü kartı güzel görünüyor; ama yeni filmler gelmiyor. Canlı API bağlantısında 401, CORS ve önbellek belirtilerini ayırt etmeden ağ hatasını çözmek zor. Önce tarayıcının istek ve cevap akışını okuyacak, sonra Sinema’yı TMDB’ye bağlayıp tekrar eden istekleri kaydedeceksin.',
  outcomes: [
    'HTTP isteğinin yöntem, URL, başlık ve gövdesini cevap durumundan ayırabilirsin',
    '4xx ve 5xx cevaplarını fetch sonucunda yakalayıp gövdesiz cevabı güvenle işleyebilirsin',
    'Origin farkını, preflight gereğini ve API tarafındaki CORS iznini açıklayabilirsin',
    'Cache-Control, ETag ve 304 akışını uygulama önbelleğinden ayırabilirsin',
    'TMDB Bearer token ve Türkçe dil parametresiyle API isteği kurabilirsin',
    'URLSearchParams ile sayfalama ve filtre parametrelerini güvenle birleştirebilirsin',
    'Trend, arama, detay, tür ve favori ekranlarını canlı veriye bağlayabilirsin',
    'Tekrar isteklerini ve eksik effect bağımlılığını gözlemleyip kaydedebilirsin',
  ],
})
