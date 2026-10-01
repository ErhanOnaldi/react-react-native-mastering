import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Config mi composition mı?',
  difficulty: 'orta',
  concepts: ['arch.component-api', 'react.composition', 'react.props'],
  question: `\
Bir film rafı kullanan ekranlar farklı içerik vermek istiyor. API şu hale gelmeye başladı:

\`\`\`tsx
<MovieShelf showTrailerButton showDescription showEmptyMessage={false} />
\`\`\`

Her ekranın JSX içeriği serbestçe değişebilecek. Yeni boolean birleşimleri üretmeden bu içeriği kim belirlemeli?`,
  options: [
    {
      text: 'Çağrı yeri içeriği `children` olarak verir; raf yalnız çerçeve davranışını yönetir',
      correct: true,
      explanation:
        'Serbest JSX çağrı yerinde kalır; raf onu gösterir ve her olası içerik için yeni flag taşımaz.',
    },
    {
      text: 'Her içeriği yeni bir `showX` boolean prop ile rafın içine eklemek',
      explanation: 'Çeşit arttıkça birbiriyle çelişebilen prop kombinasyonları büyür.',
    },
    {
      text: 'Rafın route adını okuyup içeriği seçmesi',
      explanation: 'Raf kullanım yerini tanımaya başlar ve sayfa kararlarını kendi içine taşır.',
    },
    {
      text: 'Tüm içeriği global state’ten okumak',
      explanation: 'Görünüm içeriğinin sahibi kullanım yeriyken global state gereksizdir.',
    },
  ],
})
