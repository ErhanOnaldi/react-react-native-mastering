import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Render ve commit',
  difficulty: 'kolay',
  concepts: ['react.render-cycle'],
  question: 'Bir bileşen yeni props ile çağrıldığında kesin olan nedir?',
  options: [
    {
      text: 'Bileşen fonksiyonu yeni JSX hesaplar.',
      correct: true,
      explanation: 'Render aşaması budur; DOM değişimi commit aşamasında gerekirse yapılır.',
    },
    {
      text: 'Bütün DOM sıfırdan oluşturulur.',
      correct: false,
      explanation:
        'React hesaplanan sonuçla mevcut ağacı karşılaştırır; her düğüm yeniden kurulmaz.',
    },
    {
      text: 'Bileşenin bütün event handler’ları çalışır.',
      correct: false,
      explanation: 'Handler yalnız ilgili kullanıcı olayı gerçekleşince çağrılır.',
    },
  ],
})
