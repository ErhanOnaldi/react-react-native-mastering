import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'RHF ve Zod ile giriş formu',
  difficulty: 'orta',
  concepts: [
    'form.rhf-register',
    'form.rhf-errors',
    'zod.resolver',
    'zod.schemas',
    'a11y.basics',
    'react.conditional-rendering',
  ],
  files: ['LoginForm.tsx'],
  hints: [
    'Form elemanlarını etiketleriyle bağla (`<label htmlFor="...">`); hataları `role="alert"` ile çiz.',
    'React Hook Form `useForm` ve `@hookform/resolvers/zod` ile bir Zod şeması tanımla; boş metinleri `min(1)` ile yakala.',
    'Sunucu hatası için `setError("root", { message: err.message })` kullanabilir ya da ayrı bir `rootError` state\'i tutabilirsin. Genel hatayı `{errors.root && <div role="alert">{errors.root.message}</div>}` ile bas.',
    '`<input type="password" id="password" />` için `<label htmlFor="password">Parola</label>` yazarken etiket metninin tam olarak `"Parola"` olduğundan emin ol.',
  ],
})
