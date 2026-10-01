import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Belirtiyi doğru metrikle eşleştir',
  difficulty: 'kolay',
  concepts: ['perf.web-vitals'],
  question: `Sinema sayfasında üç belirti görüyorsun: ana afiş geç geliyor, filtre düğmesi tıklanınca ekran geç tepki veriyor ve afiş yüklendiğinde başlık aşağı kayıyor. Bu belirtileri hangi sırayla LCP, INP ve CLS ile eşleştirirsin?`,
  mode: 'single',
  options: [
    {
      text: 'Ana afişin geliş süresi, tıklama tepkisi, beklenmeyen başlık kayması',
      correct: true,
      explanation:
        'LCP ana içeriğin görünmesini, INP etkileşime verilen tepkiyi, CLS beklenmeyen görsel kaymayı anlatır.',
    },
    {
      text: 'Tıklama tepkisi, başlık kayması, ana afişin geliş süresi',
      correct: false,
      explanation:
        'Bu sıra metrikleri karıştırır: tıklama tepkisi INP, kayma CLS, ana içeriğin gelişiyse LCP konusudur.',
    },
    {
      text: 'Başlık kayması, ana afişin geliş süresi, tıklama tepkisi',
      correct: false,
      explanation:
        'Başlığın beklenmedik yeri değiştirmesi CLS ile; afişin görünmesi LCP ile; tıklama tepkisi INP ile izlenir.',
    },
    {
      text: 'Ana afişin geliş süresi, başlık kayması, tıklama tepkisi',
      correct: false,
      explanation: 'İlk eşleştirme doğru; ancak başlık kayması CLS, tıklama tepkisi INP olmalıdır.',
    },
  ],
})
