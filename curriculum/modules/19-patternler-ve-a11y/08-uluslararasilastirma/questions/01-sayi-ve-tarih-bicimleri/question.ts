import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yerel biçimleri seç',
  difficulty: 'kolay',
  concepts: ['i18n.intl-formatting'],
  question:
    'Sinema bir fiyatı, gösterim tarihini ve “dün” bilgisini Türkçe arayüzde gösterecek. Hangi seçenekler kullanıcının yerel yazım alışkanlığına uyar?',
  mode: 'multiple',
  options: [
    {
      text: '`Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(1234.5)` sonucu `₺1.234,50` olur.',
      correct: true,
      explanation:
        'NumberFormat para birimi, binlik ayırıcı ve ondalık ayırıcıyı locale ile belirler.',
    },
    {
      text: '`Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" }).format(-1, "day")` sonucu `dün` olur.',
      correct: true,
      explanation: '`numeric: "auto"`, bir gün önce gibi özel göreli ifadeleri kullanabilir.',
    },
    {
      text: '`Intl.DateTimeFormat("tr-TR", { dateStyle: "long" })` her zaman ISO `YYYY-MM-DD` metni üretir.',
      correct: false,
      explanation:
        'ISO biçimi makine verisi için uygundur; DateTimeFormat kullanıcıya yerel tarih biçimini verir.',
    },
    {
      text: '`Intl.PluralRules("tr-TR").select(3)` sonucu `few` olur; Türkçe üç biçimli çoğul kullanır.',
      correct: false,
      explanation:
        'Türkçe kuralları `one` ve `other` kategorilerini verir; `3` için `other` seçilir.',
    },
  ],
})
