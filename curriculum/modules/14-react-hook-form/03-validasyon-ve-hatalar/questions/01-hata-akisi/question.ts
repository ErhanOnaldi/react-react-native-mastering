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
      text: 'Geçerli gönderim callback’i çalışmaz; RHF hata mesajını otomatik olarak input altında gösterir.',
      correct: false,
      explanation:
        'RHF geçerli callback’i atlar ve hata bilgisini errors içinde tutar; mesajı göstermek için UI’da ayrıca render etmelisin.',
    },
    {
      text: 'RHF geçerli callback’i boş string ile çalıştırır; kural yalnızca hata nesnesi ekler.',
      correct: false,
      explanation: 'Başarısız alan kuralı olduğunda `handleSubmit` geçerli callback’i çağırmaz.',
    },
  ],
})
