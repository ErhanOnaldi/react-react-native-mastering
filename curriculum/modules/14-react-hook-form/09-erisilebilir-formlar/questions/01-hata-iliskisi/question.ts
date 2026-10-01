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
      text: 'Input’ta `aria-invalid`, fakat hata metnine bağlantı yok.',
      correct: false,
      explanation:
        '`aria-invalid` durumu söyler ama hangi düzeltmenin gerektiğini anlatan metni input’a bağlamaz.',
    },
    {
      text: 'Hata metnini input’un `aria-describedby` değerinde olmayan bir id ile göstermek.',
      correct: false,
      explanation:
        'Id değerleri eşleşmezse input ile açıklama arasında programatik ilişki kurulmaz.',
    },
    {
      text: 'Hata metnini DOM’un herhangi bir yerine yazmak.',
      correct: false,
      explanation:
        'Alanla ilişki kurulmazsa kullanıcı hangi hatanın hangi input’a ait olduğunu anlayamaz.',
    },
  ],
})
