import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Nesne dependency tuzağı',
  difficulty: 'kolay',
  concepts: ['react.useEffect.deps', 'react.render-cycle'],
  question: `Bu bileşen state değişince yeniden render olur. İkinci render'da effect yeniden çalışır mı?

\`const options = { id: 550 }\`
\`useEffect(() => { console.log(options.id) }, [options])\``,
  options: [
    {
      text: 'Evet; render yeni nesne üretir ve dependency değeri değişmiş sayılır.',
      correct: true,
      explanation:
        'Aynı alanlara sahip olsa da yeni nesne ayrı bir referanstır; dependency karşılaştırması bunu fark eder.',
    },
    {
      text: 'React nesnenin alanlarını derin karşılaştırır.',
      explanation: 'Dependency karşılaştırması derin nesne karşılaştırması değildir.',
    },
    {
      text: 'Hayır; React nesnenin id alanını karşılaştırdığı için id değişmediğinde atlar.',
      explanation:
        'React dependency nesnesinin alanlarını karşılaştırmaz; burada her render yeni nesne kurar.',
    },
  ],
})
