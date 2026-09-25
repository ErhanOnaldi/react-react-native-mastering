import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'React Hook Form',
  phase: 4,
  summary:
    'Sinema formlarında alanları, doğrulamayı ve gönderimi yönetir; erişilebilir izleme listesi ve yorum formları kurarsın.',
  pain: `:::pain[Problem]
“İzleme listesi oluştur” ekranında sekiz alan için sekiz useState var. Bir harf yazınca tüm form yeniden render oluyor; kaydetmeden önce de if-else zinciri büyüyor. İlk görevde render sayacını görüp bu maliyeti ölçeceksin.
:::`,
  outcomes: [
    'Sekiz alanlı controlled formun render maliyetini ölçebilirsin',
    'register ve handleSubmit ile tipli form kurabilirsin',
    'Yerleşik kurallarla hata gösterip erişilebilir alanlar yazabilirsin',
    'Controller ile özel puan bileşeni bağlayabilirsin',
    'useFieldArray ile dinamik etiketleri yönetebilirsin',
    'Form verisini mutation ile gönderip reset ve durumları yönetebilirsin',
    'React 19 form action ile RHF sorumluluklarını karşılaştırabilirsin',
  ],
})
