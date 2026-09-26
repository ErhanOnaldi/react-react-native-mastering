import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Ekran okuyucu ne duyar?',
  difficulty: 'kolay',
  concepts: ['a11y.basics', 'test.rtl-queries'],
  question: `Sinema'daki favori düğmesi şöyle yazılmış. \`isFavorite\` **true** iken ekran okuyucu ne duyurur ve sorun ne?

\`\`\`tsx
<button
  aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
  aria-pressed={isFavorite}
  onClick={onToggle}
>
  <span aria-hidden="true">★</span>
</button>
\`\`\``,
  options: [
    {
      text: '“Favorilerden çıkar, düğme, basılı”: ad bir eylem, durum başka bir şey söylüyor; ikisi çelişiyor.',
      correct: true,
      explanation:
        'Doğru. Değişen ad zaten durumu anlatıyor; `aria-pressed` ikinci, çelişen bir bilgi ekliyor. Ya adı sabit tut (“Favori” + `aria-pressed`) ya da adı değiştir ve `aria-pressed`i kaldır.',
    },
    {
      text: 'Yalnızca “düğme” der; ad olarak yıldız okunur.',
      explanation:
        '`aria-label` düğmenin adını verir ve içerikteki metni ezer. Yıldız zaten `aria-hidden` olduğu için hiç okunmaz.',
    },
    {
      text: '“Yıldız, Favorilerden çıkar” der; `aria-hidden` düğme içinde yok sayılır.',
      explanation:
        '`aria-hidden="true"` öğeyi erişilebilirlik ağacından çıkarır; düğmenin içinde de geçerlidir.',
    },
    {
      text: 'Sorun yok; iki bilgi birbirini destekler, ne kadar çok ARIA o kadar iyi.',
      explanation:
        'Fazla ARIA yanlış ARIA’dan iyi değildir. “Basılı olan, çıkarmak mı?” sorusunu kullanıcıya bırakıyorsun.',
    },
  ],
  explanation:
    'Aç/kapa düğmelerinde tek bir yol seç: sabit ad + `aria-pressed` ya da değişen ad. Sinema’nın detay sayfası ve film kartı şu an ikisini birden yapıyor; proje görevinde düzelteceksin.',
})
