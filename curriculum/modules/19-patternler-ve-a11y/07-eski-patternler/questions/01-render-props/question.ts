import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Render prop ne geçirir?',
  difficulty: 'kolay',
  concepts: ['pattern.render-props-hoc', 'react.custom-hooks'],
  question:
    '`<MovieData id={550} render={(movie) => <h2>{movie.title}</h2>} />` ifadesinde `MovieData`’nın görevi ne, bugün aynı ihtiyacı en çok neyle karşılarız?',
  options: [
    {
      text: 'Film verisini hazırlayıp `render` fonksiyonuna verir; çizimi çağıran seçer. Bugün genelde bir custom hook (`useMovie(550)`) kullanırız.',
      correct: true,
      explanation:
        'Doğru. Render prop “mantık bende, görünüm sende” der. Hook aynı paylaşımı ekstra bileşen katmanı olmadan yapar.',
    },
    {
      text: '`movie` değişkenini global state’e yazar; bugün Redux kullanırız.',
      explanation:
        '`movie` fonksiyonun parametresidir, yereldir. Render prop global state ile ilgili değildir.',
    },
    {
      text: 'Bir HOC döndürür; bugün `forwardRef` kullanırız.',
      explanation:
        'HOC bir bileşen alıp bileşen döndürür. Burada prop olarak bir fonksiyon geçiyor. `forwardRef` ise ref aktarımıyla ilgilidir ve React 19’da çoğu zaman gerekmez.',
    },
    {
      text: 'JSX içinde koşullu hook çağırır; bugün yasaktır.',
      explanation:
        '`render` bir hook değil, sıradan bir fonksiyondur; Hook kurallarına tabi değildir.',
    },
  ],
})
