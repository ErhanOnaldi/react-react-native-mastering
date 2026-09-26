import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Portalın sınırı',
  difficulty: 'orta',
  concepts: ['pattern.portal', 'a11y.focus'],
  question:
    'Kartın overflow:hidden sınırında kesilen modalı createPortal ile body altına taşıdın. Hangisi hâlâ senin sorumluluğun?',
  options: [
    {
      text: 'Escape ve focus trap davranışını eklemek.',
      correct: true,
      explanation: 'Doğru. Portal yalnızca DOM yerini değiştirir; a11y davranışını kurmaz.',
    },
    {
      text: 'React Context bağını yeniden kurmak.',
      explanation: 'Portal DOM yerini değiştirse de React ağacındaki Context bağı korunur.',
    },
    {
      text: 'Bütün event handlerları yeniden bağlamak.',
      explanation:
        'React event’leri portalda da React ağacına göre yayılır; mevcut handlerlar çalışabilir.',
    },
    {
      text: 'Modalı mutlaka kartın içinde CSS ile saklamak.',
      explanation: 'Portalın amacı kartın kırpma sınırından çıkmaktır.',
    },
  ],
})
