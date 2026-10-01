import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yerel kontrol CI yerine geçer mi?',
  difficulty: 'kolay',
  concepts: ['tooling.git-hooks', 'tooling.scripts'],
  question: `Geliştiricinin bilgisayarında pre-commit lint'i başarılı oldu. Pull request'te CI yine lint çalıştırmalı mı?`,
  options: [
    {
      text: 'Evet; yerel hook kurulmamış ya da atlanmış olabilir, CI ortak denetim yapar.',
      correct: true,
      explanation:
        'Yerel kolaylık her geliştiricide aynı biçimde çalışmayabilir; CI sunucu tarafında tekrarlar.',
    },
    {
      text: 'Hayır; başarılı hook bütün branch değişikliklerinin kontrol edildiğini kanıtlar.',
      explanation: 'Hook yalnız yerelde çalışır ve atlanabilir; CI ortak sonucu verir.',
    },
    {
      text: 'Hayır; TypeScript derlemesi lint kurallarının tümünü denetler.',
      explanation: 'Tip kontrolü ESLint’in seçilmiş kuralları yerine geçmez.',
    },
    {
      text: 'Hayır; editörde format on save açıksa ikinci kontrol gerekmez.',
      explanation:
        'Editör yerel biçimleme sağlar, ama Hook ve diğer lint kurallarını ortak şekilde doğrulamaz.',
    },
  ],
  explanation: '',
})
