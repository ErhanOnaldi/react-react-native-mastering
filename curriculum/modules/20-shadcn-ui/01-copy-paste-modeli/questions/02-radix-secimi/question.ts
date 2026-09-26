import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Radix’i açıkça seç',
  difficulty: 'kolay',
  concepts: ['shadcn.setup', 'pattern.headless'],
  question: 'Sinema `radix-ui` kullanıyor. Yeni CLI kurulumunda hangi komut üretilen parçaların aynı primitive ailesini kullanmasını sağlar?',
  options: [
    { text: '`pnpm dlx shadcn@latest init -b radix`', correct: true, explanation: 'Doğru. Yeni kurulumun varsayılanı Base UI olduğundan Radix bayrağını açıkça verirsin.' },
    { text: '`pnpm dlx shadcn@latest init`', explanation: 'Bu komut güncel CLI’da varsayılan Base UI ile başlayabilir; Sinema için seçimi açık yaz.' },
    { text: '`pnpm add @radix-ui/react-dialog`', explanation: 'Bu tek primitive paketi kurmak CLI’ın bileşen üretim tercihini değiştirmez; kurs unified `radix-ui` kullanır.' },
  ],
})
