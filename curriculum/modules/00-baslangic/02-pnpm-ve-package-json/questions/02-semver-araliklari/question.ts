import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Şapka (^) ne kabul eder?',
  difficulty: 'kolay',
  concepts: ['tooling.semver', 'tooling.package-json'],
  mode: 'multiple',
  question:
    '`package.json`’da `"react": "^19.3.0"` yazıyor. Aşağıdaki sürümlerden **hangileri** bu aralığa uyar?',
  options: [
    {
      text: '`19.3.5`',
      correct: true,
      explanation: 'Aynı MAJOR (19), 19.3.0’dan büyük → uyar (patch güncellemesi).',
    },
    {
      text: '`19.9.0`',
      correct: true,
      explanation: 'Aynı MAJOR, daha yeni MINOR → uyar. `^` minor güncellemelere izin verir.',
    },
    {
      text: '`20.0.0`',
      explanation: 'MAJOR değişmiş: kırıcı değişiklik olabilir. `^` MAJOR atlamaz.',
    },
    {
      text: '`19.2.9`',
      explanation: 'MAJOR aynı ama 19.3.0’dan **küçük**. Aralığın alt sınırı 19.3.0.',
    },
  ],
  explanation:
    'Kural: `^X.Y.Z` → MAJOR’u X olan ve X.Y.Z’den büyük/eşit her sürüm. (MAJOR 0 ise kural daha sıkıdır; o ayrıntıya ihtiyaç duyduğumuzda değineceğiz.)',
})
