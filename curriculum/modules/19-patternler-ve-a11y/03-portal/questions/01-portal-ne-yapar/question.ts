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
      text: 'Portala taşınan alt ağacın Context değerini tekrar provider ile vermek.',
      explanation:
        'Portal DOM ağacını değiştirir, React bileşen ağacındaki yeri değiştirmez; Context değeri korunur.',
    },
    {
      text: 'React click handler’larının çalışması için onları DOM’daki yeni ebeveyne taşımak.',
      explanation:
        'Portal içindeki React event’leri React ağacına göre yayılır; DOM ebeveynine göre yeniden bağlama gerekmez.',
    },
  ],
})
