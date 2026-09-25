import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kullanıcı ne görür?',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'test.rtl-queries'],
  question:
    'Sinema favori butonunun CSS class’ı değişti. Kullanıcı davranışını hangi assertion korur?',
  options: [
    {
      text: 'Butonu rolü ve adıyla bulup tıklayınca favori durumunu sınamak',
      correct: true,
      explanation:
        'Rol ve erişilebilir ad kullanıcıya sunulan kontrolü; durum değişimi davranışı doğrular.',
    },
    {
      text: 'Butonun className değerini birebir eşleştirmek',
      explanation: 'Class tasarım ayrıntısıdır; favori davranışı aynı kalırken değişebilir.',
    },
    {
      text: 'onClick prop’unu doğrudan çağırmak',
      explanation: 'Bu, butonun gerçekten tıklanabildiğini ya da disabled olmadığını göstermez.',
    },
  ],
})
