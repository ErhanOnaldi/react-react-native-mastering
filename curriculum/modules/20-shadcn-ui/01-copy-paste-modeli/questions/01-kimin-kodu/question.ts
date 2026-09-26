import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kopyalanan kodun sahibi',
  difficulty: 'kolay',
  concepts: ['shadcn.components', 'arch.component-api'],
  question: 'CLI ile `button` ekledin. Yarın ürün tasarımcısı yalnız Sinema butonunun `variant` API’sini değiştirmek istiyor. En doğru beklenti hangisi?',
  options: [
    { text: '`src/components/ui/button.tsx` dosyasını projede düzenlerim; dosyanın kullandığı paketler yine bağımlılıktır.', correct: true, explanation: 'Doğru. CLI kaynak kodu projenin içine yazar; Radix ve cva gibi importlar normal paket bağımlılıklarıdır.' },
    { text: '`shadcn` paketinin node_modules içindeki Button export’unu değiştiririm.', explanation: 'shadcn CLI bileşen dosyasını projene kopyalar; uygulama `shadcn` runtime Button export’u kullanmaz.' },
    { text: 'Dosya değiştirilemez; sadece CSS override gerekir.', explanation: 'Kopyalama modelinde dosya senindir. API ve sınıflar da düzenlenebilir; değişikliği test etmelisin.' },
  ],
})
