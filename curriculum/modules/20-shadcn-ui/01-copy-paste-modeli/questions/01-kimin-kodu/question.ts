import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kopyalanan kodun sahibi',
  difficulty: 'kolay',
  concepts: ['shadcn.components', 'arch.component-api'],
  question:
    'CLI ile `button` ekledin. Yarın ürün tasarımcısı yalnız Sinema butonunun `variant` API’sini değiştirmek istiyor. En doğru beklenti hangisi?',
  options: [
    {
      text: '`src/components/ui/button.tsx` dosyasını projede düzenlerim; dosyanın kullandığı paketler yine bağımlılıktır.',
      correct: true,
      explanation:
        'Doğru. CLI kaynak kodu projenin içine yazar; Radix ve cva gibi importlar normal paket bağımlılıklarıdır.',
    },
    {
      text: 'Kopyalanan dosyayı düzenlerim ama `radix-ui` ve cva importlarını silerim; bağımlılıklar da dosyayla birlikte geldi.',
      explanation:
        'Kaynak dosya kopyalanır ama paketler kopyalanmaz. Import edilen çalışma zamanı paketleri uygulamanın bağımlılıkları olarak kalır.',
    },
    {
      text: 'Yalnız `components.json` içindeki `style` seçeneğini değiştiririm; bu seçenek var olan Button API’sini de yeniden yazar.',
      explanation:
        '`components.json` CLI’ın üretim tercihlerini anlatır; var olan kaynak dosyadaki public prop API’sini kendiliğinden değiştirmez.',
    },
  ],
})
