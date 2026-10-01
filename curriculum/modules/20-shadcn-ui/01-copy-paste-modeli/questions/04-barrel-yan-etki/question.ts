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
      text: '`Button`ı barrel’dan named import ederim; tree-shaking import edilen başka modüllerin yan etkilerini her durumda engeller.',
      correct: false,
      explanation:
        'Barrel değerlendirilirken yan etkili modül yine çalışabilir. Tree-shaking her yan etkiyi güvenle çıkaramaz; açık import sınırı ve kurulum noktası gerekir.',
    },
    {
      text: 'Barrel dosyasını CSS ile değiştiririm; TypeScript export sorunu çözülür.',
      correct: false,
      explanation: 'CSS, bileşen export ve import bağımlılıklarını yönetmez.',
    },
  ],
})
