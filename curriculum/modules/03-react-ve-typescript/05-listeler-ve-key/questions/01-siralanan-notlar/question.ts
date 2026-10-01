import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Sıralanan notlar',
  difficulty: 'kolay',
  concepts: ['react.lists-keys'],
  question: `İki film satırında uncontrolled input var. Listede \`key={index}\` kullanılmış. Liste ters çevrilince notlar neden yanlış filme bağlanabilir?`,
  options: [
    {
      text: 'React aynı sıra numarasındaki DOM satırını korur; artık o sırada başka film vardır.',
      correct: true,
      explanation:
        'Index kimliği filme değil konuma bağlar. Film id’si key olursa satır filmle birlikte taşınır.',
    },
    {
      text: 'React input değerlerini her render’da props’tan tekrar yazar.',
      explanation:
        'Uncontrolled input kendi DOM değerini tutar. React key ile hangi DOM satırının hangi öğeye ait olduğunu belirler.',
    },
    {
      text: 'Ters çevirmek liste öğelerinin id değerlerini değiştirir.',
      explanation:
        'Dizinin sırası değişir, film id’si değişmez. Sorun sıra index’inin kimlik gibi kullanılmasıdır.',
    },
    {
      text: 'Her listede tek bir input bulunmasına izin verilir.',
      explanation: 'Birçok input kullanılabilir. Her film satırına kararlı key vermek gerekir.',
    },
  ],
})
