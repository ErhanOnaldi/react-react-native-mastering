import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Her tuşta ne değişir?',
  difficulty: 'kolay',
  concepts: ['react.controlled-input', 'react.render-cycle', 'perf.rerender'],
  question: [
    'Bu bileşende ad alanına `A` yazınca ne olur?',
    '',
    '`name` değiştiğinde `setName` çalışır; `note` alanı aynı bileşendedir:',
    '',
    '```tsx',
    'function WatchlistForm() {',
    "  const [name, setName] = useState('')",
    "  const [note, setNote] = useState('')",
    '  return <><input value={name} onChange={(e) => setName(e.target.value)} />',
    '    <input value={note} onChange={(e) => setNote(e.target.value)} /></>',
    '}',
    '```',
  ].join('\n'),
  options: [
    {
      text: 'Form bileşeni yeniden çalışır; `note` state’i korunur ve React gereken DOM farkını uygular.',
      correct: true,
      explanation:
        'State güncellemesi bileşeni yeniden çalıştırır. Diğer state değeri korunur; her DOM düğümü baştan oluşturulmaz.',
    },
    {
      text: '`name` değişince aynı bileşendeki `note` değeri sıfırlanır.',
      correct: false,
      explanation:
        'Controlled input değişimi state güncellemesidir ve bileşen yeniden çalışır; diğer state değişkenleri saklanır.',
    },
    {
      text: 'İki state olduğu için aynı tuşta bileşen tam iki kez yeniden çalışır.',
      correct: false,
      explanation:
        'Güncellenen state adedi render sayısını çarpmaz; tek event tek state setter çağırır.',
    },
    {
      text: 'React bileşeni yeniden çalıştığında bütün input değerleri temizlenir.',
      correct: false,
      explanation:
        'State değişmeden kalırsa input değeri korunur; render DOM düğümlerini zorunlu olarak silmez.',
    },
  ],
})
