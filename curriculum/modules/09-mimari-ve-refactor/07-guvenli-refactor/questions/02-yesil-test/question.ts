import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yeşil test ne söyler?',
  difficulty: 'orta',
  concepts: ['arch.refactoring', 'arch.separation-of-concerns'],
  question: `Arama refactor'ında davranış testleri başlangıçtaki tek büyük component ile de geçiyor. Kod hâlâ loading metnini üç yerde tekrar ediyor. Bu yeşil sonuç ve rubric birlikte nasıl okunmalı?`,
  options: [
    {
      text: 'Testler ölçtüğü ekran çıktısını korur; tekrarı azaltma hedefi ayrıca incelenir',
      correct: true,
      explanation:
        'Aynı çıktıyı tekrar eden kod da üretebilir; yapı ve tekrar rubric/code review ile değerlendirilir.',
    },
    {
      text: 'Testler geçiyorsa yeni component sınırı gereksizdir',
      explanation:
        'Davranış testleri yapıyı ölçmez; istenen mimari sınır ayrı bir kalite hedefidir.',
    },
    {
      text: 'Loading metninin tek yerde olduğunu',
      explanation: 'Test aynı metni görür; kaç yerde üretildiğini ölçmez.',
    },
    {
      text: 'Başarı, hata ve boş durumların hepsinin test edildiğini',
      explanation:
        'Yalnız çalıştırılmış beklentilerin sonucu bilinir; kapsanmayan haller kanıtlanmaz.',
    },
  ],
})
