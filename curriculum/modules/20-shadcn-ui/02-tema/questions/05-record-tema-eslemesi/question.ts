import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Her durumun token’ı olsun',
  difficulty: 'orta',
  concepts: ['ts.record', 'shadcn.theming'],
  question:
    'Modül 12’de `Record` ile endpoint tablosu kurmuştun. Şimdi `type Mood = "calm" | "warning" | "danger"` için semantik renk token’larını eşleştiriyorsun. Yeni `danger` durumu eklendiğinde eksik rengi hangi tip yakalar?',
  options: [
    {
      text: '`Record<Mood, string>`',
      correct: true,
      explanation: 'Doğru. Union’daki her durum bir token ister; eksik renk derleme hatası olur.',
    },
    {
      text: '`Partial<Record<Mood, string>>`',
      correct: false,
      explanation:
        'Bu eksik durumları kabul eder; tüm durumlara renk verme sözleşmesini zayıflatır.',
    },
    {
      text: '`Record<string, string>`',
      correct: false,
      explanation: 'Rastgele anahtarları kabul eder; `Mood` seçeneklerini tamamlamayı zorlamaz.',
    },
  ],
})
