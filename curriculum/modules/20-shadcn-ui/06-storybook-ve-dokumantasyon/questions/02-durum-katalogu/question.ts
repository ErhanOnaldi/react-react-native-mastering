import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kataloğa hangi durum eklenmeli?',
  difficulty: 'orta',
  concepts: ['shadcn.storybook', 'form.rhf-errors'],
  question:
    'Bir kayıt formunun story listesinde yalnızca `Default` ve `Compact` var. Tasarımcı hata metninin uzun Türkçe cümle olduğunda yerleşimi bozup bozmadığını incelemek istiyor. En yararlı ek örnek hangisi?',
  options: [
    {
      text: '`SaveFailed` — alan hatasını ve uzun hata metnini hazır gösteren bir durum.',
      correct: true,
      explanation:
        'Doğru. İstenen görsel sınır durumu katalogda doğrudan ve tekrar edilebilir hale gelir.',
    },
    {
      text: '`Default2` — varsayılan örneğin başka bir isimle kopyası.',
      explanation: 'İsim yeni bir inceleme amacı anlatmıyor; kataloğa gürültü ekler.',
    },
    {
      text: '`AllForms` — uygulamadaki bütün formları tek bir story içinde gösteren ekran.',
      explanation:
        'Tek bir hatanın yerleşimini ayırt etmek zorlaşır; story bileşen ve duruma odaklanmalı.',
    },
  ],
})
