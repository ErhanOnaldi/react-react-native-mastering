import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Taslakta yalnız değişen alanlar',
  difficulty: 'orta',
  concepts: ['ts.partial', 'form.rhf-reset'],
  question:
    'Modül 2’de `Partial` ile form alanlarını opsiyonel yapmıştın. Düzenleme ekranında `type Watchlist = { name: string; description: string; public: boolean }`. Otomatik kayıtta yalnız kullanıcının değiştirdiği alanları saklamak için hangi tip uygun?',
  options: [
    {
      text: '`Partial<Watchlist>`',
      correct: true,
      explanation:
        'Doğru. Değişmeyen alanlar gönderilmeyebilir; tam `Watchlist` modeli yine zorunlu alanlarını korur.',
    },
    {
      text: '`Watchlist`',
      correct: false,
      explanation: 'Tam model her otomatik kayıtta değişmeyen alanların da verilmesini ister.',
    },
    {
      text: '`Pick<Watchlist, "name">`',
      correct: false,
      explanation: 'Bu yalnız adı kapsar; açıklama veya görünürlük değişirse taslağa yazılamaz.',
    },
  ],
})
