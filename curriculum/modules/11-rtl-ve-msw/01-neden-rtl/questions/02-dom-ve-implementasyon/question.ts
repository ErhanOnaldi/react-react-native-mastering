import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'DOM mu implementasyon mu?',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'test.vitest-basics'],
  question: 'Kart başlığını test ederken hangi sorgu iç yapıya en az bağlanır?',
  options: [
    {
      text: 'screen.getByRole("heading", { name: "Dövüş Kulübü" })',
      correct: true,
      explanation: 'Başlığın erişilebilir rolü ve adı kullanıcı deneyiminin parçasıdır.',
    },
    {
      text: 'container.querySelector(".movie-card > h2")',
      explanation: 'Class ve DOM hiyerarşisi refactor’da değişebilir; görünür başlık kalabilir.',
    },
    {
      text: 'component.state.title değerini okumak',
      explanation: 'RTL bileşenin iç state’ini değil, render edilmiş çıktısını sınar.',
    },
  ],
})
