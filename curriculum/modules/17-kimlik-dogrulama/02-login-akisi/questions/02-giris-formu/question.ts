import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Giriş formunu doğrula',
  difficulty: 'orta',
  concepts: ['form.rhf-register', 'form.rhf-errors', 'zod.resolver', 'zod.schemas', 'auth.jwt'],
  files: ['LoginForm.tsx'],
  hints: [
    'Boş alanların callback’e ulaşmaması ve alan hatalarının nerede gösterileceği üzerine düşün.',
    'İki alanlı Zod şemasını RHF `useForm` içinde `zodResolver` ile kullan; `register` ve `handleSubmit` ile formu bağla.',
    'API 400 hatasını catch içinde setError("root", { message }) ile göster.',
  ],
})
