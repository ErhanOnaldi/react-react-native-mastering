import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yeşil build neden yetmedi?',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'tooling.type-check', 'arch.refactoring'],
  question:
    'Sayfalama refactor’undan sonra `page` tipi doğru, fakat ikinci sayfa yerine ilki geliyor. Hangi kontrol bu hatayı doğrudan yakalar?',
  options: [
    {
      text: '`page=2` isteğinin URL’sini ve dönen sonucu sınayan davranış testi',
      correct: true,
      explanation: 'Doğru. Test, tipin ötesinde görülen sayfa sözleşmesini ölçer.',
    },
    {
      text: 'Yalnızca `tsc -b` çalıştırmak',
      correct: false,
      explanation:
        'TypeScript sayı ile string karışmasını yakalar; doğru sayfanın istendiğini bilemez.',
    },
    {
      text: 'Dosyaları Prettier ile biçimlendirmek',
      correct: false,
      explanation:
        'Biçimlendirme davranışı çalıştırmaz; yanlış query parametresi de düzgün biçimlenebilir.',
    },
  ],
})
