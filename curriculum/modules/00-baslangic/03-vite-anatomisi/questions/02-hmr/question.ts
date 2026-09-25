import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kaydedince ne olur?',
  difficulty: 'kolay',
  concepts: ['tooling.hmr', 'tooling.vite'],
  question: `Tarayıcıda bir sayaç bileşeni açık ve değeri **5**. \`Counter.tsx\` içinde yalnızca butonun rengini değiştirip kaydediyorsun.

\`pnpm dev\` çalışırken ne olur?`,
  options: [
    {
      text: 'Sayfa yenilenmeden buton yeni renge döner; sayaç 5’te kalır',
      correct: true,
      explanation:
        'Doğru. HMR yalnızca değişen modülü gönderir; React Fast Refresh bileşeni yeniden çizerken state’i korur.',
    },
    {
      text: 'Sayfa baştan yüklenir; sayaç 0’a döner',
      explanation:
        'Eski araçlar böyle çalışırdı (live reload). Vite + Fast Refresh state’i korur. (Dosya bileşen dışı şeyler de export ediyorsa tam yenileme olabilir — bunu ileride göreceğiz.)',
    },
    {
      text: 'Hiçbir şey olmaz; değişikliği görmek için `pnpm build` gerekir',
      explanation:
        '`pnpm build` production paketi içindir; geliştirmede değişiklikler anında yansır.',
    },
    {
      text: 'Vite önce tüm projeyi yeniden paketler, sonra sayfayı yeniler',
      explanation:
        'Geliştirme sunucusu projeyi paketlemez; dosyaları istendikçe tek tek dönüştürür. Bu yüzden hızlıdır.',
    },
  ],
})
