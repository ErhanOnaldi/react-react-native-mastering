import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Nesne dependency tuzağı',
  difficulty: 'kolay',
  concepts: ['react.useEffect.deps', 'react.render-cycle'],
  question:
    'Her render’da `const options = { id }` kurulup effect dependency’sine `[options]` yazılırsa ne olabilir?',
  options: [
    {
      text: 'Nesne kimliği her render’da değiştiği için effect tekrar çalışabilir.',
      correct: true,
      explanation:
        'Aynı içeriğe rağmen yeni nesne yeni referanstır; gereken primitive değeri kullan.',
    },
    {
      text: 'React nesnenin alanlarını derin karşılaştırır.',
      explanation: 'Dependency karşılaştırması derin nesne karşılaştırması değildir.',
    },
    {
      text: 'Effect sadece id değişince çalışır.',
      explanation: 'Yeni options referansı id aynıyken de oluşur.',
    },
  ],
})
