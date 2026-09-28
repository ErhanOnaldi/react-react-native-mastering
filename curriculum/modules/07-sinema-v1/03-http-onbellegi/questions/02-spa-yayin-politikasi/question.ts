import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Vite SPA yayınında en sağlam önbellek kuralı hangisidir?',
  difficulty: 'orta',
  concepts: ['web.http-cache'],
  question:
    'Vite ile build aldığında `dist/assets/index-a1b2c3.js` gibi içerik hash’li dosyalar ve kökte `index.html` üretilir. Bu uygulamanın hem hızlı açılması hem de yeni deploy’larda anında güncellenmesi için hangi önbellek başlıkları kullanılmalıdır?',
  options: [
    {
      text: '`index.html` için `no-cache`; `/assets/*` dosyaları için `public, max-age=31536000, immutable`',
      correct: true,
      explanation:
        'Doğru. `index.html` her seferinde sunucuya doğrulatılmalıdır (böylece yeni deploy’daki hash’li dosya adları hemen fark edilir). Hash’li JS/CSS dosyaları ise içerik değiştikçe yeni ada kavuştuğu için 1 yıl boyunca sunucuya hiç sorulmadan önbellekten sunulabilir.',
    },
    {
      text: 'Hem `index.html` hem tüm `/assets/*` dosyaları için `max-age=31536000`',
      explanation:
        '`index.html` 1 yıl önbellekte kalırsa kullanıcılar yeni bir sürüm yayınlandığında bunu 1 yıl boyunca fark edemez.',
    },
    {
      text: 'Hem `index.html` hem tüm `/assets/*` dosyaları için `no-store`',
      explanation:
        '`no-store` hiçbir şeyi saklamaz; uygulamanın her açılışında megabaytlarca JavaScript tekrar indirilir ve sayfa aşırı yavaşlar.',
    },
    {
      text: 'Yalnızca `index.html` önbelleğe alınmalı, `/assets/*` dosyaları her zaman ağdan çekilmelidir.',
      explanation:
        'Bu tam tersi bir felakettir: HTML değişmez ama altındaki JS dosyaları kaybolur ya da aşırı bant genişliği harcanır.',
    },
  ],
})
