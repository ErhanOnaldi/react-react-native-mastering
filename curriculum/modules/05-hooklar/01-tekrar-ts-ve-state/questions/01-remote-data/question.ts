import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Boş liste mi, yükleniyor mu?',
  difficulty: 'kolay',
  concepts: ['ts.discriminated-union', 'react.state'],
  question: 'Arama cevabı henüz gelmedi. `RemoteData<Movie[]>` için hangi durum en doğru?',
  options: [
    {
      text: '`{ status: "loading" }`',
      correct: true,
      explanation: 'Veri henüz yok; boş başarı listesinden farklı bir durum.',
    },
    {
      text: '`{ status: "success", data: [] }`',
      explanation: 'Bu başarılı ama sıfır sonuçlu cevabı anlatır.',
    },
    { text: '`{ status: "idle" }`', explanation: 'Idle, istek başlamadan önceki durumdur.' },
  ],
})
