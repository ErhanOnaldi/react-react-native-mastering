import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kopyalanan UI kodunun paketi',
  difficulty: 'orta',
  concepts: ['tooling.package-json', 'shadcn.setup'],
  question:
    'shadcn ile kopyaladığın `Button` dosyası `class-variance-authority`yi runtime’da import ediyor. Başka makinede `pnpm install` sonrası paket bulunamıyor. `package.json`da hangi değişiklik gerekir?',
  options: [
    {
      text: '`class-variance-authority`yi uygulamanın `dependencies` alanına eklemek.',
      correct: true,
      explanation:
        'Doğru. Kopyalanan kod paketi import ediyorsa uygulamanın runtime bağımlılığı manifestte yer almalıdır.',
    },
    {
      text: 'Paketi `devDependencies` içine almak; kaynak dosya derlenirken import edildiği için runtime’a ayrıca gerekmez.',
      correct: false,
      explanation:
        'Uygulama çalışırken `Button` bu paketi import ediyor; yalnız geliştirme aracının değil uygulama runtime’ının bağımlılığıdır.',
    },
    {
      text: '`components.json` içindeki alias’ı `class-variance-authority` olarak yazmak.',
      correct: false,
      explanation: 'Alias yerel kaynak dosya yolunu çözer; npm paketini kurmaz veya kaydetmez.',
    },
  ],
})
