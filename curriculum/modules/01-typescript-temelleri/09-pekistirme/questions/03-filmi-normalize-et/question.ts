import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Boş alanları normalize et',
  difficulty: 'orta',
  concepts: ['ts.narrowing', 'ts.optional-nullable', 'js.string-formatting'],
  files: ['normalizeMovie.ts'],
  hints: [
    'Yıl ve poster alanları için ayrı kararlar verip yeni bir nesne üretmeyi düşün.',
    'Boş tarih için `"Tarih yok"`, dolu tarihte `.slice(0, 4)`; boş veya null posterde `null`, dolu posterde orijinal yolu kullan.',
    'İskelet: `export function normalizeMovie(movie: RawMovie): DisplayMovie { return { id: movie.id, title: movie.title, year: movie.release_date ? movie.release_date.slice(0, 4) : "Tarih yok", poster: movie.poster_path ? movie.poster_path : null }; }`',
    '`movie.poster_path` boş string (`""`) geldiğinde `poster` alanı `null` olmalıdır; falsy kontrolünü buna göre yap.',
  ],
})
