import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Açık props sözleşmesi',
  difficulty: 'orta',
  concepts: ['ts.type-vs-interface', 'ts.object-types'],
  question:
    'Sinema’da `MovieCardProps` nesne sözleşmesini başka bir kartın props’una `extends` ile genişleteceksin. `type` ile `interface` arasındaki gerçek farkı da bilmek istiyorsun. Hangi açıklama doğru?',
  options: [
    {
      text: '`interface MovieCardProps { title: string }` yazıp `interface FeaturedProps extends MovieCardProps { badge: string }` diyebilirsin; benzer nesne tipini `type` ile de kurabilirsin, fakat `type` union tanımlamak için de kullanılır.',
      correct: true,
      explanation:
        'Doğru. İki araç nesne biçimini tanımlar; `interface` genişletilebilir bir nesne sözleşmesi için okunaklıdır, `type` ise union gibi birleşimleri de adlandırır.',
    },
    {
      text: '`interface` union tipi tanımlar, `type` yalnız class için çalışır.',
      correct: false,
      explanation:
        '`interface` doğrudan union tanımlamaz; `type` nesne, union ve başka tip ifadelerini adlandırabilir.',
    },
    {
      text: '`type` ile tanımlanan props React bileşeninde kullanılamaz.',
      correct: false,
      explanation:
        'React props tipi `type` veya `interface` olabilir; seçim bileşenin çalışmasını değiştirmez.',
    },
  ],
})
