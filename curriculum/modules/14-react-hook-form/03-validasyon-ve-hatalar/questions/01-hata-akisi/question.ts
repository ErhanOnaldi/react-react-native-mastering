import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Boş isimde ne olur?',
  difficulty: 'kolay',
  concepts: ['form.rhf-errors', 'form.rhf-register'],
  question:
    '`register("name", { required: "Ad gerekli" })` ile bağlı alan boşken form gönderilirse ne olur?',
  options: [
    {
      text: 'Geçerli submit callback’i çalışmaz; `errors.name.message` gösterilebilir.',
      correct: true,
      explanation: 'RHF yerleşik kuralı uygular ve alan hatasını formState altında tutar.',
    },
    {
      text: 'Callback boş string ile yine çalışır; yalnızca konsola uyarı gelir.',
      correct: false,
      explanation: '`handleSubmit` geçersiz veriyi geçerli callback’e göndermez.',
    },
    {
      text: 'Input kendiliğinden kırmızı olur ve label oluşur.',
      correct: false,
      explanation: 'Görünüm ve label ilişkisini sen kurarsın.',
    },
    {
      text: '`required` yalnızca TypeScript derleme anında çalışır.',
      correct: false,
      explanation: 'Bu kural form gönderiminde çalışma zamanında değerlendirilir.',
    },
  ],
})
