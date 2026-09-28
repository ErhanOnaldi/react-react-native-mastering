import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Görsel ve font optimizasyonu',
  difficulty: 'orta',
  concepts: ['perf.asset-delivery', 'perf.web-vitals'],
  question: `Bir geliştirici, web sitesindeki tüm \`<img>\` etiketlerine topluca \`loading="lazy"\` özniteliği eklemiş ve sayfanın en üstündeki vitrin (hero) görselinde de bu özniteliği bırakmıştır. Ayrıca sayfada kullanılan harici web fontu için CSS içinde \`font-display: swap\` tanımlamıştır.

Bu yapılandırmanın Web Vitals metrikleri (LCP ve CLS) üzerindeki etkisi hakkında aşağıdakilerden hangisi **doğrudur**?`,
  mode: 'single',
  options: [
    {
      text: 'Vitrin (LCP) görseline `loading="lazy"` vermek tarayıcının indirme önceliğini düşürerek LCP süresini geciktirir. `font-display: swap` ise metnin hemen sistem fontuyla görünmesini sağlar ancak özel font indiğinde metin boyutları farklıysa CLS riski doğurabilir.',
      correct: true,
      explanation:
        'Doğru. Ekranın ilk açılışında görünür alanda (above-the-fold) yer alan LCP görseli asla lazy yüklenmemelidir; aksine `fetchpriority="high"` ile erkenden çekilmelidir. `font-display: swap` metnin gizlenmesini (FOIT) önler, fakat sistem fontu ile web fontunun harf genişlikleri çok farklıysa font değiştiği an satırlar kayabilir (CLS).',
    },
    {
      text: 'Vitrin görseline `loading="lazy"` eklemek LCP süresini kısaltır; çünkü görsel tarayıcı boşta kaldığında öncelikli olarak indirilir.',
      correct: false,
      explanation:
        'Yanlış. `loading="lazy"` tarayıcıya "bu görsel kullanıcı ona yaklaşana kadar indirmeyi ertele" talimatı verir. En üstteki görsel için bu erteleme, tarayıcının görseli hemen istemesini engeller ve LCP\'yi ciddi şekilde kötüleştirir.',
    },
    {
      text: "`font-display: swap` font tamamen inene kadar metni ekranda tamamen görünmez kılar (FOIT) ve LCP'yi sıfırlar.",
      correct: false,
      explanation:
        "Yanlış. Metni gizleyen davranış `font-display: block`'tur. `swap` tam tersine metni derhal bir yedek (fallback/sistem) fontuyla gösterir, font dosyası indiğinde takas (swap) eder.",
    },
    {
      text: "Görsellere `width` ve `height` öznitelikleri vermek LCP'yi etkilemez ve modern tarayıcılarda CLS'i önlemek için bir fayda sağlamaz.",
      correct: false,
      explanation:
        'Yanlış. Görsellere sayısal `width` ve `height` (veya CSS `aspect-ratio`) vermek, görsel henüz ağdan inmeden önce tarayıcının DOM üzerinde tam yer tutucu alan ayırmasını sağlar ve görsel yüklendiğinde oluşacak yerleşim kaymasını (CLS) tamamen önler.',
    },
  ],
  explanation: `Varlık (asset) optimizasyonunda iki altın kural:
1. **LCP Görselleri:** Görünür alandaki ana görsel asla \`loading="lazy"\` almamalıdır. Erken indirilmesi için \`fetchpriority="high"\` ve gerekirse \`<link rel="preload">\` kullanılmalıdır. Ekran dışı görseller ise kesinlikle \`loading="lazy"\` olmalıdır.
2. **CLS Önleme:** Her görselin mutlaka doğal \`width\` ve \`height\` değerleri (veya CSS \`aspect-ratio\`) olmalıdır ki tarayıcı indirme bitmeden doğru boşluğu rezerve edebilsin.`,
})
