import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Mutation durumunu oku',
  difficulty: 'kolay',
  concepts: ['query.useMutation', 'form.rhf-register'],
  question:
    '`handleSubmit(values => mutation.mutate(values))` kullanılıyor. Ağ isteği sürerken butonu hangi değerle kapatmak güvenilir?',
  options: [
    {
      text: '`mutation.isPending`',
      correct: true,
      explanation: '`mutate` beklemeden döner; mutation kendi ağ yaşam döngüsünü izler.',
    },
    {
      text: 'Yalnızca `formState.isSubmitting`',
      correct: false,
      explanation:
        'Senkron callback hemen dönerse bu değer isteğin sonuna kadar pending kalmayabilir.',
    },
    {
      text: '`formState.isDirty`',
      correct: false,
      explanation: 'Kirli olmak isteğin hâlâ sürdüğünü söylemez.',
    },
    {
      text: '`errors` nesnesinin varlığı',
      correct: false,
      explanation: 'Alan hatası ile ağ isteği durumu farklıdır.',
    },
  ],
})
