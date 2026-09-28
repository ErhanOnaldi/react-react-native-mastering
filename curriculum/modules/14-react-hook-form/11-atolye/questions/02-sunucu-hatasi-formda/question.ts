import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sunucu hatası formda',
  difficulty: 'orta',
  concepts: ['form.rhf-errors', 'form.rhf-register', 'fetch.error-handling'],
  files: ['RatingForm.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Hata cevabından sonra ekranda hangi değer kalmalı? Aynı formu tekrar gönderebilmek için gerekli seçime bak.',
    'Mutation sonucunu başarı ve hata dallarında ayrı değerlendir; formun temizlenme anı başarıya bağlı olmalı.',
    'Başarısız istekte mesajı göster ama `reset()` çağırma; başarılı yanıtta temizle ve eski hatayı kaldır.',
  ],
})
