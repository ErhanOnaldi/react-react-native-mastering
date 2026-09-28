import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Env ne zaman değişir?',
  difficulty: 'orta',
  concepts: ['deploy.env', 'tooling.vite'],
  question:
    'Bir SPA dün `VITE_API_URL=https://staging.example` ile build edildi. Bugün host ortamında değer `https://api.example` yapıldı, ancak `dist/` yeniden üretilmedi. Tarayıcı hangi adresi kullanır?',
  options: [
    {
      text: '`https://staging.example`; değer build sırasında JavaScript’e yerleşmiştir.',
      correct: true,
      explanation:
        'Statik bundle çalışma anında host env’ini yeniden okumaz. Yeni değer için yeniden build gerekir.',
    },
    {
      text: '`https://api.example`; tarayıcı host sürecinin env’ini her açılışta okur.',
      correct: false,
      explanation:
        'Tarayıcı host sürecindeki ortam değişkenlerine erişmez; yalnızca sunulan dosyaları alır.',
    },
    {
      text: 'İstek atılmaz; Vite üretimde tüm `VITE_` değerlerini siler.',
      correct: false,
      explanation: '`VITE_` önekli değerler istemci bundle’ına gömülür; bu yüzden sır sayılmazlar.',
    },
  ],
})
