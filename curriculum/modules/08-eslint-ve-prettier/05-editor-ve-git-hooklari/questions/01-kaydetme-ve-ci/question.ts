import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kaydetme ve CI',
  difficulty: 'kolay',
  concepts: ['tooling.prettier', 'tooling.scripts'],
  question:
    'Sinema’da herkesin editör ayarı farklı. Ortak biçim kuralını hangi düzen güvenceye alır?',
  options: [
    {
      text: 'Repoda Prettier config’i ve CI’da `format:check` script’i.',
      correct: true,
      explanation: 'Config ortak karardır; CI herkesin değişikliğini aynı biçimde denetler.',
    },
    {
      text: 'Yalnızca bir geliştiricinin format on save ayarı.',
      explanation: 'Yerel editör tercihi diğerlerinin dosyasını zorunlu olarak biçimlendirmez.',
    },
    {
      text: 'CI’da `prettier --write .` çalıştırmak.',
      explanation:
        'CI’nın sessiz dosya değiştirmesi yerine `--check` ile başarısız olması gerekir.',
    },
    {
      text: 'Sadece `tsc -b` çalıştırmak.',
      explanation: 'TypeScript biçim tercihlerini kontrol etmez.',
    },
  ],
  explanation: '',
})
