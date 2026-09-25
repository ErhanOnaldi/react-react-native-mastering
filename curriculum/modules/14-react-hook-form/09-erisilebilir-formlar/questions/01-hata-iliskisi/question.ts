import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi hata ilişkisi?',
  difficulty: 'kolay',
  concepts: ['form.a11y', 'a11y.basics'],
  question:
    '“Liste adı” input’u hata verdiğinde ekran okuyucunun hata metnini alanla ilişkilendirmesi için ne gerekir?',
  options: [
    {
      text: 'Label eşleşmesi, `aria-invalid` ve hata elemanının id’sine işaret eden `aria-describedby`.',
      correct: true,
      explanation: 'Görsel mesajın yanında programatik ilişki de kurulur.',
    },
    {
      text: 'Sadece kırmızı kenarlık.',
      correct: false,
      explanation: 'Renk tek başına anlamı aktaramaz.',
    },
    {
      text: 'Sadece placeholder.',
      correct: false,
      explanation: 'Placeholder kalıcı label değildir.',
    },
    {
      text: 'Hata metnini DOM’un herhangi bir yerine yazmak.',
      correct: false,
      explanation:
        'Alanla ilişki kurulmazsa kullanıcı hangi hatanın hangi input’a ait olduğunu anlayamaz.',
    },
  ],
})
