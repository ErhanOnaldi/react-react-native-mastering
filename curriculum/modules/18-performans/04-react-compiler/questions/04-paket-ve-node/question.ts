import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Compiler paketleri nerede çalışır?',
  difficulty: 'orta',
  concepts: ['tooling.package-json', 'tooling.node-runtime'],
  question:
    'React Compiler için build sırasında çalışan Babel/Vite eklentilerini ekliyorsun. Tarayıcı bu eklentileri çalıştırmıyor. `package.json` ve Node açısından doğru yerleşim hangisi?',
  options: [
    {
      text: 'Eklentileri `devDependencies` altında tut; build script’i bu araçları Node.js sürecinde çalıştırır.',
      correct: true,
      explanation:
        'Doğru. Tarayıcı uygulamasının runtime bağımlılığı değiller; geliştirme ve üretim derlemesinin araçlarıdır.',
    },
    {
      text: 'Eklentileri `dependencies`e koy; tarayıcı her render’da Babel’i çalıştırır.',
      correct: false,
      explanation:
        'Compiler dönüşümü build sırasında yapılır; tarayıcıda her render için Babel çalışmaz.',
    },
    {
      text: '`package.json`a gerek yok; `tsconfig` eklentileri kendiliğinden indirir.',
      correct: false,
      explanation:
        'TypeScript ayarı paket kurmaz; paket sürümleri manifest ve lockfile ile yönetilir.',
    },
  ],
})
