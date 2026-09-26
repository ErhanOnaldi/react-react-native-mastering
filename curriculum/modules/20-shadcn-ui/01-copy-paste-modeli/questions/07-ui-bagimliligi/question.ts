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
      text: 'Yalnız `components.json` içindeki alias’ı değiştirmek.',
      correct: false,
      explanation: 'Alias yerel dosya yolunu çözer; eksik npm paketini kurmaz.',
    },
    {
      text: 'Paketi yalnız global olarak kurmak.',
      correct: false,
      explanation:
        'Global kurulum başka geliştirici ve CI makinesi için tekrarlanabilir bağımlılık kaydı değildir.',
    },
  ],
})
