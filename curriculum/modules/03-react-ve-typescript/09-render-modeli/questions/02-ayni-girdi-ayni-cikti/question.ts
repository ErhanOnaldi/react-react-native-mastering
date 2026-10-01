import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Render aynı girdiye ne verir?',
  difficulty: 'orta',
  concepts: ['react.render-cycle'],
  question: `Bu bileşeni iki kez aynı props ile çağırırsan başlık ne olur?\n\n\`\`\`tsx\nfunction MovieTitle({ title }: { title: string }) {\n  return <h2>{title}</h2>\n}\n\n<MovieTitle title="Matrix" />\n<MovieTitle title="Matrix" />\n\`\`\``,
  options: [
    {
      text: 'Her ikisi de “Matrix” başlığını hesaplar.',
      correct: true,
      explanation: 'Bileşen props değerinden JSX hesaplar; aynı girdiye aynı başlığı verir.',
    },
    {
      text: 'İkinci çağrı props içindeki başlığı “Matrix 2” yapar.',
      explanation: 'Render sırasında props değiştirilmez; başlık yalnızca verilen değerden okunur.',
    },
    {
      text: 'İlk çağrı başlığı DOM’a ekler, ikinci çağrı bütün sayfayı yeniden kurar.',
      explanation: 'Render JSX hesabıdır. Commit aşamasında yalnızca gereken DOM güncellenir.',
    },
    {
      text: 'Başlık yalnızca click handler çalışırsa görünür.',
      explanation: 'Bu bileşen render edildiğinde JSX üretir; burada click handler yoktur.',
    },
  ],
})
