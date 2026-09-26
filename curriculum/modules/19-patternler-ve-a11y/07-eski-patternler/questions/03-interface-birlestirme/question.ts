import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Eski declaration merging sürprizi',
  difficulty: 'orta',
  concepts: ['ts.type-vs-interface', 'pattern.render-props-hoc'],
  question:
    'Eski bir UI paketinde iki dosya aynı `interface LegacyCardProps` adına alan ekliyor. Yeni `type LegacyCardProps = { ... }` yazınca aynı ada ikinci tanım hata veriyor. Bunun nedeni hangisi?',
  options: [
    {
      text: 'Aynı adlı `interface` bildirimleri birleşebilir; `type` alias aynı kapsamda yeniden tanımlanamaz.',
      correct: true,
      explanation:
        'Doğru. Declaration merging eski API’lerde görülebilir; yeni props tasarımında bunun bilinçli olup olmadığını kontrol et.',
    },
    {
      text: '`type` alias her zaman runtime nesnesi oluşturur, `interface` oluşturmaz.',
      correct: false,
      explanation: 'İkisi de yalnız tip düzeyindedir; runtime nesnesi üretmezler.',
    },
    {
      text: '`interface` hiçbir zaman başka bir interface’i genişletemez.',
      correct: false,
      explanation:
        '`interface` `extends` ile genişleyebilir; buradaki fark aynı adlı bildirimin birleşmesidir.',
    },
  ],
})
