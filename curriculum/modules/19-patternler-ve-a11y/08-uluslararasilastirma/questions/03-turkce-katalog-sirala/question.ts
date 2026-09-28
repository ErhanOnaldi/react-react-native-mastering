import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film kataloğunu Türkçe sırala ve ara',
  difficulty: 'orta',
  concepts: ['i18n.locale-text', 'js.array-methods'],
  files: ['localizedMovies.ts'],
  hints: [
    'Arama karşılaştırması ve alfabetik sıralama ayrı ihtiyaçlar; ikisi de Türkçe i/ı ayrımını korumalı.',
    '`toLocaleLowerCase("tr-TR")` ile aramayı, `Intl.Collator("tr-TR")` ile sıralamayı yerelleştir.',
    'Sorguyu kırpıp normalize et; eşleşen yeni dizi üzerinde `collator.compare` kullan. Kaynak diziyi değiştirme.',
  ],
  rubric: [
    'Girdi dizisini değiştirmez',
    'Türkçe büyük/küçük harf kurallarıyla arar',
    'Türkçe alfabe sırasına göre sıralar',
  ],
})
