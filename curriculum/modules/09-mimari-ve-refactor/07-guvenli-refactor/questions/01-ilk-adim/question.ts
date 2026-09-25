import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'İlk refactor adımı',
  difficulty: 'kolay',
  concepts: ['arch.refactoring', 'test.what-to-test'],
  question: 'Çalışan SearchPage’i ayırmadan önce en güvenli ilk adım nedir?',
  options: [
    {
      text: 'Mevcut arama, boş sonuç ve sayfa davranışını doğrula',
      correct: true,
      explanation: 'Doğru. Önce davranış sınırını bilmek, sonra küçük taşımalar yapmak gerekir.',
    },
    {
      text: 'Tüm dosyaları bir seferde yeniden yaz',
      explanation: 'Hata çıkınca kaynağını izlemek zorlaşır.',
    },
    {
      text: 'Testleri yeni koda göre hemen değiştir',
      explanation:
        'Refactor davranışı korumalı; test beklentisini erken değiştirmek regresyonu gizler.',
    },
    {
      text: 'Eski dosyaları silip sonra import’ları düşün',
      explanation: 'Küçük ve derlenebilir adımlar geri dönüşü kolaylaştırır.',
    },
  ],
})
