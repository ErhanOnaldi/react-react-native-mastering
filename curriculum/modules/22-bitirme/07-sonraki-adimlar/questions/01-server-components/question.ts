import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Eser sayfasını sunucu ve istemci arasında böl',
  difficulty: 'orta',
  concepts: [
    'ecosystem.server-components',
    'ecosystem.nextjs',
    'react.state',
    'arch.state-categories',
  ],
  question:
    'Kitaplık’ın herkese açık eser açıklaması ilk HTML’de görünsün istiyorsun. Okuma listesi hâlâ bu tarayıcıdaki `localStorage`’da ve form etkileşimli. Next.js App Router’a geçersen en uygun ilk bölme hangisi?',
  options: [
    {
      text: 'Eser verisini Server Component’ta al; okuma listesi formunu Client Component yap.',
      correct: true,
      explanation:
        'Doğru. Herkese açık veri sunucuda render edilebilir. `localStorage`, state ve event handler kullanan form ise istemci sınırında kalır.',
    },
    {
      text: 'Bütün sayfayı Server Component yap; `localStorage` ve `useState` orada da çalışır.',
      explanation:
        'Server Component tarayıcı ortamına sahip değildir: `localStorage`, event handler ve etkileşimli state için Client Component gerekir.',
    },
    {
      text: 'Bütün dosyalara `use client` ekle; bu ilk HTML’deki eser verisini otomatik iyileştirir.',
      explanation:
        '`use client` istemci sınırını büyütür. Herkese açık veriyi sunucuda alma hedefini tek başına çözmez; etkileşimli alt ağacı sınırlamak daha anlamlıdır.',
    },
    {
      text: 'Server Component kullanmak için okuma listesini mutlaka Redux’a taşı.',
      explanation:
        'Redux, sunucu/istemci sınırının şartı değildir. Kişisel liste hâlâ tarayıcıdaysa onu okuyan form Client Component olur; state aracı ayrı karardır.',
    },
  ],
  explanation:
    'Bu seçim, 2. dersteki state haritasının yeni çalışma ortamındaki devamıdır: herkese açık sunucu verisi ile tarayıcıya ait kişisel veri farklı sahiplerde kalır.',
})
