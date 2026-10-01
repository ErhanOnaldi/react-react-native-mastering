import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Geri tuşu neden çalışmıyor?',
  difficulty: 'kolay',
  concepts: ['router.setup', 'react.state'],
  question:
    'Sinema `setPage("details")` ile detay gösteriyor. Adres hâlâ `/`. Geri tuşuna basınca niçin listeye dönmüyor?',
  options: [
    {
      text: '`useState` tarayıcı geçmişine kayıt eklemez.',
      correct: true,
      explanation: 'Doğru. React ağacı değişir, fakat adres ve history değişmez.',
    },
    {
      text: 'Geri tuşu aynı adreste kalırken React state değerini önceki haline alamaz.',
      explanation:
        'Geri tuşu React state geçmişini değil, tarayıcının adres geçmişini izler. Adres hiç değişmediği için döneceği başka bir kayıt yok.',
    },
    {
      text: 'Detay başlığı değişince tarayıcı yeni bir history kaydı kendiliğinden ekler.',
      explanation:
        'Ekranda başka içerik göstermek adresi değiştirmez. History kaydı için tarayıcı adresine de navigasyon gerekir.',
    },
  ],
})
