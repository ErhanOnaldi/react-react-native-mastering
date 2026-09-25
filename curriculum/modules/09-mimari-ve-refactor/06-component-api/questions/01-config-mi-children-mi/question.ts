import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Config mi composition mı?',
  difficulty: 'orta',
  concepts: ['arch.component-api', 'react.composition', 'react.props'],
  question:
    'MovieShelf’in bir ekranda düğme, başka ekranda açıklama göstermesi gerekiyor. İçerik serbestçe değişecek. En uygun API nedir?',
  options: [
    {
      text: 'children veya ayrı slot prop ile composition',
      correct: true,
      explanation: 'Doğru. Serbest içerik için her çeşidi yeni boolean prop’a çevirmeye gerek yok.',
    },
    {
      text: 'Her varyant için yeni showX boolean’ı',
      explanation: 'Çeşit arttıkça birbiriyle çelişebilen prop kombinasyonları büyür.',
    },
    {
      text: 'Bileşenin içinde route adına bakmak',
      explanation: 'Bileşen kullanım yerini bilirse bağımlılık tersine döner.',
    },
    {
      text: 'Tüm içeriği global state’ten okumak',
      explanation: 'Görünüm içeriğinin sahibi kullanım yeriyken global state gereksizdir.',
    },
  ],
})
