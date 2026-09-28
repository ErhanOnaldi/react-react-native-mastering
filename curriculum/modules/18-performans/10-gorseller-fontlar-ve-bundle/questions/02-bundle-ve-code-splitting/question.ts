import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Bundle boyutu ve route bazlı kod bölme',
  difficulty: 'orta',
  concepts: ['perf.asset-delivery', 'perf.code-splitting'],
  question: `Büyük bir SPA projesinde Vite ile production build alındığında tek bir \`index.js\` dosyasının 1.8 MB boyuta ulaştığı görülmüştür. Kullanıcı sadece ana sayfayı ziyaret ettiğinde bile profil düzenleme, admin paneli ve video oynatıcı gibi sayfaların tüm JavaScript kodu aynı anda indirilmektedir.

Bu durumun ilk sayfa yükleme hızına (LCP) olumsuz etkisini çözmek için modern React ve Vite mimarisinde **en standart ve etkili yaklaşım** hangisidir?`,
  mode: 'single',
  options: [
    {
      text: 'Sayfa bileşenlerini `React.lazy` ve dinamik `import()` ile sarmalayarak route düzeyinde kod bölme (route-based code splitting) uygulamak ve yükleme anlarını `<Suspense>` ile yönetmek.',
      correct: true,
      explanation:
        'Doğru. Route bazlı kod bölme sayesinde Vite her sayfa için ayrı birer JavaScript parçası (chunk) üretir. Kullanıcı ana sayfadayken yalnızca ana sayfa kodunu indirir; detay veya profil sayfalarının kodu kullanıcı o adrese tıkladığında arka planda çekilir. Bu da ilk yükleme paketini küçülterek LCP süresini dramatik biçimde düşürür.',
    },
    {
      text: 'Tüm bileşenleri tek bir dosyada birleştirip `inline` JavaScript olarak `index.html` içine gömmek.',
      correct: false,
      explanation:
        'Yanlış. JavaScript kodunu HTML içine gömmek HTML dosyasının boyutunu devasa hale getirir, tarayıcının HTTP önbelleğinden (cache) yararlanmasını engeller ve ilk bayt süresini (TTFB) felç eder.',
    },
    {
      text: 'Vite ayarlarında `build.minify: false` yaparak kodun ayrıştırılma (parse) süresini sıfıra indirmek.',
      correct: false,
      explanation:
        'Yanlış. Minify işlemini kapatmak dosya boyutunu 2-3 kat artırır; ağ üzerinden aktarılacak veri miktarını büyüterek performansı daha da kötüleştirir.',
    },
    {
      text: 'Bileşenlerdeki tüm `useEffect` çağrılarını kaldırıp yerine `setTimeout` ile 10 saniyelik gecikme koymak.',
      correct: false,
      explanation:
        'Yanlış. `useEffect` geciktirmek bundle boyutunu değiştirmez; indirilen JavaScript dosyası aynı kalır ve kullanıcı deneyimi bozulur.',
    },
  ],
  explanation: `Route bazlı kod bölme (Route-based Code Splitting), bir SPA'nın ilk açılış performansını koruyan temel mimari desendir:
- \`const MovieDetails = React.lazy(() => import('./pages/MovieDetailsPage'))\`
- Router seviyesinde bu bileşenler bir \`<Suspense fallback={<Spinner />}>\` ile sarılır.
- Vite build anında her sayfa için ayrı hash'li birer JS dosyası üretir. Böylece kullanıcı yalnızca gezdiği sayfaların kodunu indirir.`,
})
