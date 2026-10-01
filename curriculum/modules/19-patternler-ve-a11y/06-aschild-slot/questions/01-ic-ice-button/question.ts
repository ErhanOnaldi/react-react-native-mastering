import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'asChild neden gerekli?',
  difficulty: 'orta',
  concepts: ['pattern.slot', 'a11y.basics'],
  question: `Kartta zaten bir button var. Modal.Trigger kendi button'unu üretirse iki etkileşimli öğe iç içe giriyor. 

Child'ın click handler'ı modalı açmayı iptal edebilmeli; bu API hangi davranışı sağlamalı?`,
  options: [
    {
      text: 'Tek child DOM öğesini korumalı; child handler’ını çalıştırıp iptal edilmediyse açma davranışını eklemeli.',
      correct: true,
      explanation:
        'Tek öğe semantik ve focus davranışını korur. Önce child handler’ını çalıştırmak onun `preventDefault` ile açmayı engellemesine imkân verir.',
    },
    {
      text: 'Child button’u DOM’da bırakıp Trigger button’unu `aria-hidden` yapmalı.',
      explanation:
        '`aria-hidden` yalnızca erişilebilirlik ağacını etkiler; iç içe etkileşimli öğe ve focus sırası sorunu sürer.',
    },
    {
      text: 'Child handler’ını kaldırıp yalnızca Trigger’ın açma handler’ını çalıştırmalı.',
      explanation:
        'Bu, child’ın kendi davranışını kaybettirir. İki handler da çalışmalı; iptal kararı child’a kalabilir.',
    },
    {
      text: 'Child ref’i koruyup Trigger ref’ini ayrı, yeni bir button’a bağlamalı.',
      explanation:
        'İki ref’in farklı düğümlere bağlanması tek DOM öğesi sözleşmesini bozar; ref’ler aynı node’a ulaşmalı.',
    },
  ],
})
