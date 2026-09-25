import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film listesi',
  difficulty: 'kolay',
  concepts: ['react.lists-keys', 'js.array-methods', 'react.props'],
  files: ['MovieList.tsx'],
  hints: [
    'Liste boşken kullanıcı ne görecek?',
    'Boş durumda erken dönüş yap; dolu listede `map` kullan.',
    '`movies.map(movie => <li key={movie.id}><h2>{movie.title}</h2></li>)` biçiminde kur.',
  ],
})
