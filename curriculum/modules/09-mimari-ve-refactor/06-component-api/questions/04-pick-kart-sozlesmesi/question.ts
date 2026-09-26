import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Detay tipinden kart props’u',
  difficulty: 'orta',
  concepts: ['ts.pick', 'arch.component-api'],
  question:
    'Modül 2’de `Pick` ile film alanlarını seçmiştin. Şimdi `Movie` tipinde `id`, `title`, `overview`, `poster_path` ve `credits` var. Kart yalnız `id`, `title`, `poster_path` kullanacak. Hangi props tanımı değişen `Movie` tipiyle birlikte güncellenir?',
  options: [
    {
      text: '`type MovieCardProps = Pick<Movie, "id" | "title" | "poster_path">`',
      correct: true,
      explanation:
        'Doğru. Kartın yüzeyi yalnız ihtiyaç duyduğu alanlardan türetilir; `credits` ve uzun açıklama props’a sızmaz.',
    },
    {
      text: '`type MovieCardProps = Movie`',
      correct: false,
      explanation:
        'Tam film tipi kartı gereksiz ayrıntılara bağlar; test verisi ve yeniden kullanım ağırlaşır.',
    },
    {
      text: '`type MovieCardProps = Partial<Movie>`',
      correct: false,
      explanation:
        '`Partial` her alanı opsiyonel yapar; kartın zorunlu id ve başlığını garanti etmez.',
    },
  ],
})
