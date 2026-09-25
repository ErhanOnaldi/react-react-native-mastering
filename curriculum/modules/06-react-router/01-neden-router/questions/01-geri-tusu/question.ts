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
      text: 'React state çok yavaş güncellendiği için.',
      explanation: 'Hız ile ilgisi yok; state güncellense de tarayıcı geçmişi değişmez.',
    },
    {
      text: 'Detay bileşeninde `useEffect` eksik olduğu için.',
      explanation: 'Effect dış sistemle senkron içindir; sayfa geçişini history ile eşleştirmez.',
    },
  ],
})
