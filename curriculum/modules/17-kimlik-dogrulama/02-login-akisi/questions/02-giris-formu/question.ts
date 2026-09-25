import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Giriş formunu doğrula',
  difficulty: 'orta',
  concepts: ['form.rhf-register', 'form.rhf-errors', 'zod.resolver', 'zod.schemas', 'auth.jwt'],
  files: ['LoginForm.tsx'],
  hints: [
    'İki alanlı bir Zod şeması kur; boş değerleri submit öncesi engelle.',
    'useForm resolver: zodResolver(schema), onSubmit: handleSubmit(...) kullan.',
    'API 400 hatasını catch içinde setError("root", { message }) ile göster.',
  ],
})
