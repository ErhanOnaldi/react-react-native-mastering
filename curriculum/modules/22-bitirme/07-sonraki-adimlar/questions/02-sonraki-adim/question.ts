import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kitaplık’ı telefona taşırken ilk karar',
  difficulty: 'orta',
  concepts: ['ecosystem.react-native', 'capstone.state-map', 'arch.adr', 'test.what-to-test'],
  question:
    'Kitaplık’ın mağazadan yüklenen iOS/Android sürümü isteniyor. Tek bir Dune detay ekranıyla başlayacaksın. Hangi plan, React bilgisini doğru taşır ve yeni riskleri görünür kılar?',
  options: [
    {
      text: 'Expo ile küçük bir React Native ekranı kur; veri şemasını yeniden kullan, arayüzü yerel bileşenlerle yaz ve depolama için yeni ADR oluştur.',
      correct: true,
      explanation:
        'Doğru. React bileşen/veri mantığı taşınır; DOM/CSS ve web `localStorage` doğrudan taşınmaz. Küçük deney ve yeni depolama kararı riski sınırlar.',
    },
    {
      text: 'Mevcut `div` ve CSS dosyalarını React Native’e aynen kopyala; yalnız Vite config’ini değiştir.',
      explanation:
        'React Native DOM etiketleriyle render etmez. `View`, `Text`, `Pressable` gibi yerel bileşenler ve farklı stil/depolama ortamı gerekir.',
    },
    {
      text: 'Önce bütün uygulamayı yeniden yaz; tek ekranlık deney gerçek mimariyi göstermez.',
      explanation:
        'Tek ekranlık deney, yerel arayüz, ağ ve depolama farklarını erken gösterir. Tüm uygulamayı taşımadan önce riskleri ölçebilirsin.',
    },
    {
      text: 'Next.js App Router kullan; Server Components otomatik olarak yerel telefon arayüzü üretir.',
      explanation:
        'Next.js web uygulaması framework’üdür. Server Components veri/render sınırını değiştirir; iOS/Android yerel bileşenleri üretmez.',
    },
  ],
  explanation:
    'Sinema → Kitaplık aktarımında yaptığın gibi önce eski kavramların hangisinin aynı kaldığını, hangisinin yeni ortamda değiştiğini yaz.',
})
