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
      text: 'Callback ilk render’daki `query` değerini tutar; boş dependency dizisi effect’i yeniden kurmaz.',
      correct: true,
      explanation:
        'Her render kendi değerlerini üretir. `[]` değişmediği için eski callback ve timer çalışmayı sürdürür.',
    },
    {
      text: '`setInterval` React state’ini her çalışışında yeniden okuyup en güncel metni basar.',
      correct: false,
      explanation:
        'Timer callback’i oluşturulduğu render’ın değişkenlerini kapatır; yeni render eski callback’in içini değiştirmez.',
    },
    {
      text: 'Render olunca cleanup timer’ı kapatır; React aynı render’da effect’i yeniden kurar.',
      correct: false,
      explanation:
        'Dependency listesi `[]` olduğu için sıradan bir render cleanup veya yeni effect kurulumu başlatmaz.',
    },
  ],
})
