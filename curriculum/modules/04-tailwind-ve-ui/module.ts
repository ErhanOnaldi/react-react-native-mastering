import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Tailwind ve UI bileşenleri',
  phase: 1,
  summary:
    'Sinema’nın dağınık class dizilerini Tailwind CSS v4, tema token’ları, cn() ve cva ile tutarlı bir UI kit’e dönüştürürüz.',
  pain: `:::pain[Problem]
Sinema’da favori butonu, arama butonu ve filtre düğmesi aynı on iki class’ı kopyalıyor. Aktif durum için \'btn \' + (active ? \'on\' : \'\') eklenince her kopya biraz farklılaşıyor. Kartta \'p-2\' ile dışarıdan gelen \'p-4\' çakışınca JSX’te son yazılan değil, üretilen CSS’in sırası kazanıyor. Bir butonu düzeltmek artık yirmi dosyayı taramak demek.
:::`,
  outcomes: [
    'Tailwind CSS v4 kurulumunu ve utility class’ları okuyabilirsin',
    'Flex, grid ve responsive varyantlarla poster ızgarası kurabilirsin',
    'Durum ve dark mode varyantlarını erişilebilir etkileşimlere uygulayabilirsin',
    '@theme ile tekrar kullanılan tasarım token’ları tanımlayabilirsin',
    'clsx ve tailwind-merge ile çakışmayan cn() yazabilirsin',
    'cva ile tipli Button varyantları ve tekrar kullanılabilir UI bileşenleri oluşturabilirsin',
  ],
})
