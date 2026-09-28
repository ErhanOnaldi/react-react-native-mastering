import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Çerez oturumunda istek',
  difficulty: 'orta',
  concepts: ['security.csrf', 'security.cookies'],
  question:
    'Çerezle giriş yapan kullanıcı adına başka site durum değiştiren istek tetikliyor. Hangi savunma birleşimi uygundur?',
  options: [
    {
      text: 'SameSite sınırı, CSRF token ve durum değiştirmeyen GET.',
      correct: true,
      explanation:
        'Bu önlemler farklı yollarla otomatik çerez gönderiminin kötüye kullanımını azaltır.',
    },
    {
      text: "Yalnızca butonu UI'dan gizlemek.",
      correct: false,
      explanation:
        'Saldırgan tarayıcıya doğrudan HTTP isteği başlatabilir; UI görünürlüğü yetki denetimi değildir.',
    },
    {
      text: 'POST yerine GET kullanmak.',
      correct: false,
      explanation: 'GET durum değiştirmemeli; link veya gömülü kaynakla tetiklenmesi kolaydır.',
    },
  ],
})
