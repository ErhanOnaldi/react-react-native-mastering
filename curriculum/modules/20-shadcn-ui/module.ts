import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'shadcn/ui',
  phase: 5,
  optional: true,
  summary:
    'shadcn/ui kaynak kodunu sahiplenir, tema ve form parçalarını Sinema’da uygular, sonra Dialog ve form davranışlarını atölyede yeniden kullanırsın. Storybook, tamamladığın bileşenleri belgelemek için isteğe bağlı son okumadır.',
  pain: `Sinema'da fragman dialogunu ve film menüsünü erişilebilir yapmak için focus, Escape, portal ve klavye davranışını tek tek yazdın. Her yeni dropdown'da aynı yük yeniden karşına çıkıyor; kaynak kodu projende duran UI parçaları ve belgelenmiş durum örnekleri bu işi tutarlı kılabilir.`,
  outcomes: [
    'shadcn/ui copy-paste modelini ve Radix seçimini açıklayabilirsin',
    'components.json ile üretilen dosyaların yerini okuyabilirsin',
    'Radix Slot ve cva ile esnek bir buton yazabilirsin',
    'Tailwind v4 CSS değişkenleriyle açık ve koyu temayı düzenleyebilirsin',
    'RHF ve Zod ile erişilebilir bir form kurabilirsin',
    'Sinema arayüzünü kendi kopyaladığın UI parçalarıyla yenileyebilirsin',
    'İsteğe bağlı Storybook okumasıyla bileşen durumlarını story’lerle belgeleyip ekip içinde paylaşabilirsin',
  ],
})
