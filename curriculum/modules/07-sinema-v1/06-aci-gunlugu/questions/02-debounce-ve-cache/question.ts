import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Debounce hangi isteği azaltır?',
  difficulty: 'orta',
  concepts: ['react.custom-hooks', 'fetch.basics', 'router.search-params'],
  question:
    '`useDebounce(q, 350)` ekledin. "Matrix" yazarken birkaç tuş isteği azalıyor. Sonra detaya gidip geri geliyorsun ve aynı arama GET’i yeniden gidiyor. Neden?',
  options: [
    {
      text: 'Debounce yalnızca hızlı değişen q değerini bekletir; önceki API cevabını saklamaz.',
      correct: true,
      explanation:
        'Doğru. Zamanlama ve cache farklı sorunları çözer. Yeniden mount, aynı q için yeni effect başlatır.',
    },
    {
      text: 'Debounce yalnızca Türkçe karakterli aramada çalışır.',
      explanation:
        'Hook karakter türüne bakmaz; verilen değerin değişimi ve gecikme süresiyle ilgilenir.',
    },
    {
      text: 'Geri tuşu URL’deki q değerini siler.',
      explanation:
        'URL state geri navigasyonda korunur. Tam da q kaldığı için aynı arama yeniden yapılabilir.',
    },
    {
      text: 'AbortController başarılı cevapları otomatik cache’ler.',
      explanation:
        'AbortController devam eden isteği iptal edebilir; başarılı cevapları saklayan bir veri deposu değildir.',
    },
  ],
})
