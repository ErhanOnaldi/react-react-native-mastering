import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'PerformanceObserver ve buffered seçeneği',
  difficulty: 'orta',
  concepts: ['perf.web-vitals'],
  question: `Modern tarayıcılarda Web Vitals metriklerini JavaScript koduyla programatik olarak izlemek için \`PerformanceObserver\` API'si kullanılır:

\`\`\`ts
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.startTime)
  }
})

observer.observe({ type: 'largest-contentful-paint', buffered: true })
\`\`\`

Yukarıdaki çağrıda \`buffered: true\` seçeneğinin kullanılmasının **temel amacı** nedir?`,
  mode: 'single',
  options: [
    {
      text: 'Observer kaydedilmeden önce (sayfa ilk açılırken) gerçekleşmiş olan eski performans olaylarının da geriye dönük olarak dinleyiciye teslim edilmesini sağlar.',
      correct: true,
      explanation:
        'Doğru. JavaScript dosyası veya React bileşeni yüklenip observer çalışana kadar sayfanın ilk LCP veya layout-shift olayları çoktan gerçekleşmiş olabilir. `buffered: true` belirtilmezse observer yalnızca kaydedildikten SONRAKİ yeni olayları yakalar ve ilk yükleme metriklerini kaçırır.',
    },
    {
      text: 'Olayları anında konsola basmak yerine tarayıcı belleğinde gzip ile sıkıştırıp ağ trafiğini azaltır.',
      correct: false,
      explanation:
        "Yanlış. `buffered: true` ağ trafiği veya gzip sıkıştırmasıyla ilgili değildir; tarayıcının performans tampon belleğinde (performance buffer) kayıtlı geçmiş olayları observer'a aktarma yeteneğidir.",
    },
    {
      text: 'Performans gözleminin ana iş parçacığını (main thread) kilitlemesini engellemek için Web Worker içine taşır.',
      correct: false,
      explanation:
        'Yanlış. PerformanceObserver zaten tarayıcı tarafından asenkron olarak tetiklenir; `buffered` seçeneği Worker başlatmaz, sadece geçmiş olay tamponunu dahil eder.',
    },
    {
      text: 'Yalnızca kullanıcı sayfayla etkileşime geçtiğinde (tıklama veya kaydırma anında) tetiklenmesini garanti eder.',
      correct: false,
      explanation:
        'Yanlış. Kullanıcı etkileşimi `hadRecentInput` veya `event` türü ile ilgilidir. `buffered: true` sayfa açılışından itibaren birikmiş geçmiş girdileri çekmek içindir.',
    },
  ],
  explanation: `Bir SPA veya React uygulamasında JavaScript paketleri asenkron olarak yüklenir. Eğer \`PerformanceObserver\` oluşturulduğunda tarayıcı HTML'i çoktan çizip LCP öğesini boyamışsa, \`buffered: true\` olmadan dinlemeye başlarsan o LCP olayını asla yakalayamazsın. Bu yüzden Web Vitals izleme araçları her zaman \`buffered: true\` kullanır.`,
})
