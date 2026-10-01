import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kaydetme ve CI',
  difficulty: 'kolay',
  concepts: ['tooling.prettier', 'tooling.scripts'],
  question: `Sinema için şu script'ler tanımlı:

\`\`\`json
{
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
\`\`\`

CI'da biçim farkını dosyaları değiştirmeden raporlamak için hangisini çalıştırırsın?`,
  options: [
    {
      text: '`format:check`; biçim farkını bildirir, dosyaları yazmaz.',
      correct: true,
      explanation: '`--check` mevcut dosyaları denetler ve fark bulursa başarısız olur.',
    },
    {
      text: '`format`; aynı anda biçimi kontrol eder ve dosyaları sessizce değiştirmez.',
      explanation: '`--write` dosyaları değiştirir; kontrol için `--check` gerekir.',
    },
    {
      text: "CI'da iki script'i arka arkaya çalıştırmak.",
      explanation:
        'İlki dosyaları yazar; CI farkı göstermek istiyorsa yalnız `format:check` çağırmalıdır.',
    },
    {
      text: 'Yalnız `eslint .` çalıştırmak.',
      explanation: 'ESLint seçilmiş kod kurallarını inceler; bu script biçim farkını denetlemez.',
    },
  ],
  explanation: '',
})
