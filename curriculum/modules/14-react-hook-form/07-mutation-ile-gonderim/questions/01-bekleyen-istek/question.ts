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
      text: '`formState.isSubmitting` ancak submit callback’i mutation Promise’ini beklerse.',
      correct: false,
      explanation:
        'Senkron callback hemen dönerse bu değer isteğin sonuna kadar pending kalmayabilir.',
    },
    {
      text: '`mutation.isSuccess`',
      correct: false,
      explanation: 'Bu değer istek başarıyla bittikten sonrayı gösterir; beklerken true değildir.',
    },
    {
      text: '`formState.isDirty`',
      correct: false,
      explanation:
        'Kirli durum form değerinin başlangıçtan farklı olduğunu söyler, isteğin hâlâ sürdüğünü değil.',
    },
  ],
})
