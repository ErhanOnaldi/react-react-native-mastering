import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'UI barrel’ında gizli import',
  difficulty: 'orta',
  concepts: ['arch.barrel-files', 'shadcn.setup'],
  question:
    '`components/ui/index.ts` bütün UI bileşenlerini re-export ediyor. Sadece `Button` kullanan sayfa bu barrel’ı import ediyor, ama barrel içindeki bir modül import anında tema kaydı yapıyor. İlk neyi değiştirirsin?',
  options: [
    {
      text: 'Yan etkili kaydı açık kurulum noktasına taşıyıp `Button`ı doğrudan dosyasından import ederim; barrel’ın sınırını gözden geçiririm.',
      correct: true,
      explanation:
        'Doğru. Barrel bağımlılıkları görünmez kılabilir; modül düzeyi yan etkiyi açık bir kurulum adımına taşımak yüklemeyi öngörülebilir yapar.',
    },
    {
      text: 'Her bileşeni barrel’dan import etmeye devam edip `sideEffects: false` yazarım.',
      correct: false,
      explanation:
        'Gerçek yan etki varken bu işaretleme kodun yanlışlıkla atılmasına yol açabilir.',
    },
    {
      text: 'Barrel dosyasını CSS ile değiştiririm; TypeScript export sorunu çözülür.',
      correct: false,
      explanation: 'CSS, bileşen export ve import bağımlılıklarını yönetmez.',
    },
  ],
})
