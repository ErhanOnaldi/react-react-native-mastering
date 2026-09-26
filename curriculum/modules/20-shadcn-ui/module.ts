import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'shadcn/ui',
  phase: 5,
  optional: true,
  summary: 'Radix tabanlı erişilebilir parçaları projene alıp kendi bileşenlerin gibi düzenlersin.',
  pain: `Sinema'da fragman dialogunu ve film menüsünü erişilebilir yapmak için focus, Escape, portal ve klavye davranışını tek tek yazdın. Her yeni dropdown'da aynı yük yeniden karşına çıkıyor. Hazır davranışı alıp görünümü ve kodu sahiplenmenin zamanı geldi.`,
  outcomes: [
    'shadcn/ui copy-paste modelini ve Radix seçimini açıklayabilirsin',
    'components.json ile üretilen dosyaların yerini okuyabilirsin',
    'Radix Slot ve cva ile esnek bir buton yazabilirsin',
    'Tailwind v4 CSS değişkenleriyle açık ve koyu temayı düzenleyebilirsin',
    'RHF ve Zod ile erişilebilir bir form kurabilirsin',
    'Sinema arayüzünü kendi kopyaladığın UI parçalarıyla yenileyebilirsin',
  ],
})
