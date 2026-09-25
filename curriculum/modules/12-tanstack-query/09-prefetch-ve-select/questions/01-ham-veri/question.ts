import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'select ve cache',
  difficulty: 'kolay',
  concepts: ['query.select', 'query.prefetch', 'ts.inference'],
  question:
    'Bir bileşen `select` ile yalnız film başlıklarını okuyor. Başka bileşen aynı key’den ham `results` okuyabilir mi?',
  options: [
    {
      text: 'Evet; select gözlenen veriyi dönüştürür, cache ham cevabı tutar',
      correct: true,
      explanation: 'Aynı cache farklı görüntülere hizmet edebilir.',
    },
    {
      text: 'Hayır; select cache’deki veriyi kalıcı diziye dönüştürür',
      explanation: 'select cache içeriğini değiştirmez.',
    },
    {
      text: 'Yalnız `gcTime: 0` ise okuyabilir',
      explanation: 'gcTime ile select’in dönüşümü bağımsızdır.',
    },
  ],
})
