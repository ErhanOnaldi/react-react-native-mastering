import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Favori ile taslak',
  difficulty: 'orta',
  concepts: ['arch.state-categories', 'react.controlled-input', 'react.context'],
  question: `Kullanıcı Dövüş Kulübü'nü favoriledi ve yorum kutusuna "Harika" yazdı. Sonra sayfayı yeniliyor. Ürün kararı favoriyi bu cihazda saklıyor, ama taslağı göndermeden saklamıyor. Hangisi beklenen eşleşme?`,
  options: [
    {
      text: 'Favori client state; yorum metni form state',
      correct: true,
      explanation:
        'Favori cihazdaki tercih olduğu için saklanabilir; yorum ise gönderilmemiş form taslağıdır ve yenilemede kaybolabilir.',
    },
    {
      text: 'İkisi de server state',
      explanation:
        'TMDB verisi olabilir ama bu iki değer kullanıcı tarafından yerelde oluşturuldu.',
    },
    {
      text: 'Favori URL state, yorum client state',
      explanation:
        'Favori başkasına paylaşılan bir sayfa seçimi değil; yorum da genel cihaz tercihi değil, form taslağı.',
    },
    {
      text: 'Favori form state, yorum client preference',
      explanation: 'Yıldız bir taslak alanı değil; yazılan yorumun sahibi form gönderimidir.',
    },
  ],
})
