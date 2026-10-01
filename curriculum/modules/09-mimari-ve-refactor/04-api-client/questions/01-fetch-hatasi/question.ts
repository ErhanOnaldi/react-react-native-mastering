import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '404 neden fırlamadı?',
  difficulty: 'kolay',
  concepts: ['arch.api-client', 'arch.api-error', 'fetch.error-handling', 'web.http-anatomy'],
  question: `\n\`\`\`ts\ntry {\n  const response = await fetch('/movie/999999')\n  return await response.json()\n} catch {\n  return { title: 'Bulunamadı' }\n}\n\`\`\`\n\nTMDB 404 JSON cevabı verdiğinde bu kod hangisini yapar?`,
  options: [
    {
      text: '404 cevabının JSON gövdesini döndürür; bu kod hata sonucunu ayrıca ele almaz',
      correct: true,
      explanation:
        'HTTP 404 bir cevaptır; `fetch` onu hata diye reddetmez. `response.ok` ayrıca denetlenmeli.',
    },
    {
      text: 'catch çalışır ve `Bulunamadı` nesnesi döner',
      explanation:
        '`fetch` yalnız ağ seviyesinde reddedildiğinde buraya gelir; HTTP 404 kendi başına reject değildir.',
    },
    {
      text: 'Çağrı beklemeden `undefined` döner',
      explanation: 'Kod iki await kullanıyor; cevap geldiğinde JSON gövdesi döner.',
    },
    {
      text: 'TypeScript JSON içindeki 404 alanını hata olarak çevirir',
      explanation:
        'TypeScript derleme anında çalışır; HTTP cevabını çalışma anında sınıflandırmaz.',
    },
  ],
})
