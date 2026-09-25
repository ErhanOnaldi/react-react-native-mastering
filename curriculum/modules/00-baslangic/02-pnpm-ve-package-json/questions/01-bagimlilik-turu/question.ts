import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi gruba?',
  difficulty: 'kolay',
  concepts: ['tooling.package-json', 'tooling.pnpm'],
  question: `Sinema projesine iki paket ekleyeceksin:

- \`zod\` — formlardaki verileri **tarayıcıda** doğrulayacak
- \`vitest\` — testleri **terminalde** çalıştıracak

Doğru komut çifti hangisi?`,
  options: [
    {
      text: '`pnpm add zod` ve `pnpm add -D vitest`',
      correct: true,
      explanation:
        'Doğru. zod’u uygulama kodu import ediyor, kullanıcının tarayıcısına gidiyor → dependency. vitest yalnızca geliştirirken çalışıyor → devDependency (`-D`).',
    },
    {
      text: '`pnpm add -D zod` ve `pnpm add vitest`',
      explanation: 'Ters. Tarayıcıya giden kodun import ettiği paket (zod) dependencies’e girer.',
    },
    {
      text: 'İkisi de `pnpm add -D` ile',
      explanation:
        'Geliştirirken fark etmez gibi görünür; ama zod son kullanıcıya giden kodun parçası. `--prod` kurulumlarında eksik kalır.',
    },
    {
      text: 'Fark etmez, ikisi de node_modules’e iner',
      explanation:
        'İkisi de iner, ama ayrım projenin sözleşmesidir: kurulum araçları, bundle analizi ve güvenlik taramaları bu ayrıma göre davranır.',
    },
  ],
})
