import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Boş liste mi, yükleniyor mu?',
  difficulty: 'kolay',
  concepts: ['ts.discriminated-union', 'react.state'],
  question: `Bu kod ekranda hangi metni üretir?

\`const result: RemoteData<string[]> = { status: 'success', data: [] }\`
\n\n\`result.status === 'success' && result.data.length === 0\` ? 'Sonuç yok' : 'Bekle'`,
  options: [
    {
      text: '`Sonuç yok`',
      correct: true,
      explanation: 'Success durumu var ve dizi boş; koşul doğru olduğu için bu metin seçilir.',
    },
    {
      text: '`Bekle`',
      explanation: 'Bekle yalnız koşul yanlış olduğunda görünür; boş başarıda koşul doğrudur.',
    },
    {
      text: 'Kod `data` alanını okuyamaz ve hata verir.',
      explanation:
        'Önce status kontrol edildiği için TypeScript ve JavaScript success dalında data alanına ulaşır.',
    },
  ],
})
