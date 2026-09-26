import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Compiler öncesi lint kapısı',
  difficulty: 'orta',
  concepts: ['tooling.eslint', 'perf.compiler'],
  question:
    'React Compiler açıkken bir bileşen Hook’u koşullu çağırıyor. `pnpm build` tamamlanmış görünse de o bileşen optimize edilmemiş. Hangi kontrol sorunun kaynağını en doğrudan gösterir?',
  options: [
    {
      text: 'React Hooks ve compiler ESLint kurallarını çalıştırıp koşullu Hook çağrısını düzeltmek.',
      correct: true,
      explanation:
        'Doğru. Derleme başarısı Hook kurallarına uyumu kanıtlamaz; lint kuralı yanlış çağrı düzenini gösterir.',
    },
    {
      text: 'Yalnız Prettier çalıştırmak.',
      correct: false,
      explanation:
        'Prettier biçimi düzeltir; koşullu Hook çağrısının davranış kuralını denetlemez.',
    },
    {
      text: 'Her bileşene `memo` eklemek.',
      correct: false,
      explanation:
        '`memo` geçersiz Hook çağrısını geçerli yapmaz ve compiler’ın atlama nedenini çözmez.',
    },
  ],
})
