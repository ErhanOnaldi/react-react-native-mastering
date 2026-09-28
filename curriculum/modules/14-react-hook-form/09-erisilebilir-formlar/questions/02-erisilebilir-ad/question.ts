import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Hata ile alanı ilişkilendir',
  difficulty: 'orta',
  concepts: ['form.a11y', 'form.rhf-errors', 'test.rtl-queries'],
  files: ['AccessibleNameForm.tsx'],
  hints: [
    'Placeholder metni input odaktan çıkınca kaybolur; alanın kalıcı adını ve hata bilgisini ayrı ayrı planla.',
    'Native label bağlantısı için `htmlFor`/`id`, geçersizlik için `aria-invalid`, açıklama için `aria-describedby` kullan.',
    'Hata varken aynı id değerini input `aria-describedby` ve hata paragrafında kullan; paragrafı `role="alert"` ile göster.',
  ],
})
