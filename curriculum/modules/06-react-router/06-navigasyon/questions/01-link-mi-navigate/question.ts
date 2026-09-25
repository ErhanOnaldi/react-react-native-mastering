import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Link mi navigate mi?',
  difficulty: 'orta',
  concepts: ['router.navigation', 'a11y.basics'],
  question: 'Menüde önceden belli `/favorites` adresine gidiliyor. Hangi kullanım uygun?',
  options: [
    {
      text: '<Link to="/favorites">Favoriler</Link>',
      correct: true,
      explanation: 'Doğru. Bağlantı yeni sekme, adres kopyalama ve klavye davranışını korur.',
    },
    {
      text: '`<button onClick={() => navigate("/favorites")}>` tek doğru yol.',
      explanation:
        'Programatik navigasyon işlem sonrası yönlendirmeye uygundur; bilinen adres bir linktir.',
    },
    { text: '`setPage("favorites")`.', explanation: 'Adres ve tarayıcı geçmişi yine değişmez.' },
  ],
})
