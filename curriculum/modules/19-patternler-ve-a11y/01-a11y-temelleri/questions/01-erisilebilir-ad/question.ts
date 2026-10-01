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
      text: '“Favorilerden çıkar, basılı” der; değişen ad eylemi, durum niteliği ise toggle durumunu bildirir.',
      explanation:
        'İki mesaj da ayrı ayrı duyulabilir; fakat bu örnekte eylem adı ile basılı durumu farklı yönlere işaret eder. Tek bir anlatım seçmek daha açıktır.',
    },
    {
      text: 'Düğmenin adı “Favori” olur; `aria-pressed` değeri adın parçası olarak okunmaz.',
      explanation:
        'Bu, sabit ad + durum tasarımında doğru olurdu. Burada ad eyleme göre değiştiği için aynı düğmenin iki farklı durumu farklı eylem adıyla duyuruluyor.',
    },
  ],
  explanation:
    'Aç/kapa düğmelerinde tek bir yol seç: sabit ad + `aria-pressed` ya da değişen ad. Sinema’nın detay sayfası ve film kartı şu an ikisini birden yapıyor; proje görevinde düzelteceksin.',
})
