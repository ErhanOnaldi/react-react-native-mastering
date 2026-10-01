import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Görsel kontrolün sınırı',
  difficulty: 'orta',
  concepts: ['shadcn.storybook', 'a11y.keyboard', 'test.what-to-test'],
  question:
    'Bir dropdown story’sinin görsel regresyon karşılaştırması değişiklikten önceki görüntüyle aynı çıktı. Kullanıcılar menüyü Enter ile açamadığını bildiriyor. Hangi kontrol eksik?',
  options: [
    {
      text: 'Klavye etkileşimini davranışsal olarak denemek; görüntü karşılaştırması olay akışını doğrulamaz.',
      correct: true,
      explanation:
        'Doğru. Görsel regresyon piksel farkını arar; Enter ve ok tuşlarıyla etkileşim ayrı sınanır.',
    },
    {
      text: 'Story adını `DropdownMenu` olarak değiştirmek; isim klavye desteğini etkinleştirir.',
      explanation: 'Story adı dokümantasyon içindir, primitive davranışını değiştirmez.',
    },
    {
      text: 'Aynı screenshot karşılaştırmasını daha yüksek çözünürlükte çalıştırmak.',
      explanation: 'Çözünürlük, Enter tuşunun menüyü açıp açmadığını göstermez.',
    },
  ],
})
