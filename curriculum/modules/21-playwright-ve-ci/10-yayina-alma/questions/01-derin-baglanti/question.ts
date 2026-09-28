import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Derin bağlantı neden 404?',
  difficulty: 'kolay',
  concepts: ['deploy.spa-fallback', 'router.params'],
  question:
    '`/etkinlik/42` adresine uygulama içinden gidiliyor, ama aynı adres yenilenince statik host 404 döndürüyor. En olası neden nedir?',
  options: [
    {
      text: 'Host bu yol için dosya arıyor; bilinmeyen uygulama yollarında `index.html` sunmuyor.',
      correct: true,
      explanation:
        'İstemci router’ı ancak HTML ve JS yüklendikten sonra çalışır. İlk HTTP isteğinde host fallback vermelidir.',
    },
    {
      text: 'React Router, parametreli URL’lerde yalnızca istemci içi gezinmeyi destekler.',
      correct: false,
      explanation:
        'Router doğrudan açılan URL’yi de çözer; önce host’un uygulama kabuğunu sunması gerekir.',
    },
    {
      text: 'Hash’li JS dosyaları 404 döndüğünde HTML cache süresi artırılmalıdır.',
      correct: false,
      explanation:
        'Derin URL için sunucu yolu çözümlemesi gerekir; cache süresi tek başına 404’ü düzeltmez.',
    },
  ],
})
