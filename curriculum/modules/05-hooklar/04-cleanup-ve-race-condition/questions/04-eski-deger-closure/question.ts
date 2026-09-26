import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Timer hangi değeri hatırlar?',
  difficulty: 'orta',
  concepts: ['js.closures', 'react.useEffect.deps'],
  question:
    'Bir effect `useEffect(() => { const id = setInterval(() => console.log(query), 1000); return () => clearInterval(id) }, [])` kuruyor. İlk render’da `query="film"`, sonra kullanıcı `"matrix"` yazıyor. Timer neden hâlâ `"film"` yazabilir?',
  options: [
    {
      text: 'Callback ilk render’ın `query` değerini closure içinde tutar; `query` dependency olmalı ve eski timer cleanup ile kapanmalı.',
      correct: true,
      explanation:
        'Doğru. Her render kendi değerlerini üretir. Dependency değişince effect yeniden kurulur ve cleanup önceki timer’ı temizler.',
    },
    {
      text: '`setInterval` her zaman en yeni React state’ini kendiliğinden okur.',
      correct: false,
      explanation:
        'Timer callback’i oluşturulduğu render’ın değişkenlerini kapatır; yeni render eski callback’in içini değiştirmez.',
    },
    {
      text: '`clearInterval` yalnız bileşen unmount olunca çalışır, bu yüzden dependency önemli değildir.',
      correct: false,
      explanation:
        'Dependency değişiminde de cleanup çalışır; sonra yeni değerle yeni effect kurulur.',
    },
  ],
})
