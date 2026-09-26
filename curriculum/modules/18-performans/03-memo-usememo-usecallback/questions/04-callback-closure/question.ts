import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Sabit callback, eski filtre',
  difficulty: 'orta',
  concepts: ['js.closures', 'react.useCallback'],
  question:
    'Kart listesindeki `onSelect = useCallback(() => openMovie(filter), [])` callback’ini `memo` için sabit tuttun. Kullanıcı filtreyi değiştirince callback hâlâ eski filtreyi açıyor. Neden?',
  options: [
    {
      text: 'Callback oluşturulduğu render’ın `filter` değerini closure içinde tutar; dependency’ye `filter` ekle.',
      correct: true,
      explanation:
        'Doğru. Sabit referans eski değerle birlikte sabit kalır; dependency değişince yeni callback gerekir.',
    },
    {
      text: '`memo` seçimi her zaman state’i sıfırlar.',
      correct: false,
      explanation:
        '`memo` props karşılaştırır; burada sorun callback’in eski render değerini kapatmasıdır.',
    },
    {
      text: '`filter`ı `const` yerine `let` yapmak eski callback’i günceller.',
      correct: false,
      explanation:
        'Yeni render yeni bağlayıcı üretir; eski closure’daki değişken `let` ile de kendiliğinden değişmez.',
    },
  ],
})
