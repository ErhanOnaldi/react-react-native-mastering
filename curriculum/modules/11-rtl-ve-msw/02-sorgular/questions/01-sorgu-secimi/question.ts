import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Doğru sorguyu seç',
  difficulty: 'kolay',
  concepts: ['test.rtl-queries', 'a11y.basics'],
  question: '"Film ara" etiketli bir arama input’unu nasıl bulursun?',
  options: [
    {
      text: 'screen.getByRole("searchbox", { name: "Film ara" })',
      correct: true,
      explanation: 'Role ve name birlikte hem input türünü hem etiketini doğrular.',
    },
    {
      text: 'screen.getByText("Film ara")',
      explanation: 'Bu etiket metnini bulabilir, input öğesini bulmaz.',
    },
    {
      text: 'screen.getByTestId("search")',
      explanation: 'Test id çalışabilir ama erişilebilir adın doğru olmasını garanti etmez.',
    },
  ],
})
