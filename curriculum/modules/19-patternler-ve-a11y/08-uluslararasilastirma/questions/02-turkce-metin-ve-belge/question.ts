import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Türkçe metni doğru karşılaştır',
  difficulty: 'orta',
  concepts: ['i18n.locale-text', 'i18n.document-direction'],
  question:
    'Bir film kataloğunda başlığa göre arama ve sıralama var. Ayrıca belgeye Türkçe dilini bildirmek ve ileride sağdan sola bir dile geçebilmek istiyorsun. Doğru kararları seç.',
  mode: 'multiple',
  options: [
    {
      text: 'Türkçe sıralama için `Intl.Collator("tr")` kullan; varsayılan `sort()` Türk alfabesini bilmez.',
      correct: true,
      explanation:
        'Collator locale kurallarını uygular; varsayılan sıralama UTF-16 kod birimlerini karşılaştırır.',
    },
    {
      text: 'Türkçe küçük harfe dönüştürmede `toLocaleLowerCase("tr-TR")` kullan; `I` harfi `ı` olur.',
      correct: true,
      explanation:
        'Türkçede noktalı ve noktasız I farklı harflerdir; locale duyarlı case dönüşümü bunu korur.',
    },
    {
      text: 'Tüm diller için `toLowerCase()` yeterlidir; locale yalnızca sayı biçiminde önemlidir.',
      correct: false,
      explanation: 'Harf dönüşümü de dile göre değişir; Türkçe `I` ve `i` bunun görünür örneğidir.',
    },
    {
      text: 'Yatay aralıkları `margin-left` ile yaz; `dir="rtl"` verildiğinde tarayıcı bu CSS özelliğini otomatik tersine çevirir.',
      correct: false,
      explanation:
        'Fiziksel `margin-left` sola bağlı kalır. `margin-inline-start` gibi mantıksal özellikler yazı yönüne göre uyarlanır.',
    },
    {
      text: 'Belge köküne `lang="tr"` yaz; yön gereksinimi varsa `dir` değerini ayrıca belirle.',
      correct: true,
      explanation:
        '`lang` dil bilgisini, `dir` yazı yönünü belirtir; biri diğerinin yerine geçmez.',
    },
  ],
})
