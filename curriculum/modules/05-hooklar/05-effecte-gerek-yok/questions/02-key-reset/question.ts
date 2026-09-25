import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Film değişince not alanı',
  difficulty: 'kolay',
  concepts: ['react.lists-keys', 'react.derived-state'],
  question: 'Detay bileşeninin yerel not alanı film değişince sıfırlansın. En açık kimlik çözümü?',
  options: [
    {
      text: 'Alt bileşene `key={movie.id}` vermek.',
      correct: true,
      explanation:
        'Yeni key, React için yeni bileşen kimliği demektir; yerel state yeniden kurulur.',
    },
    {
      text: 'Her render’da input değerini boşaltmak.',
      explanation: 'Kullanıcının yazdığı notu da her render’da siler.',
    },
    {
      text: 'Notu bir ref’te saklamak.',
      explanation: 'Ref ekranı güncellemez ve kimlik sorununu çözmez.',
    },
  ],
})
