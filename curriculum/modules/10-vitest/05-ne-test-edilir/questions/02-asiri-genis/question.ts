import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Zayıf testin boşluğu',
  difficulty: 'kolay',
  concepts: ['test.what-to-test', 'fetch.query-params'],
  question: 'Bir test yalnızca “fetch çağrıldı” diyor. Hangi bug bu testten kaçabilir?',
  options: [
    {
      text: 'İkinci sayfa istendiğinde URL’ye `page=1` yazılması',
      correct: true,
      explanation: 'Çağrı yine yapılır; parametre ölçülmediği için hata görünmez.',
    },
    {
      text: 'Hiç fetch çağrılmaması',
      correct: false,
      explanation: 'Bu durumda çağrı assertion’ı kırılır; test bunu zaten yakalar.',
    },
    {
      text: 'Fonksiyon adının değiştirilmesi',
      correct: false,
      explanation:
        'İsim değişikliği eski import’u bozarsa test derlenmez; burada kaçan davranış, istek atılırken yanlış sayfanın seçilmesidir.',
    },
  ],
})
