import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorumu DummyJSON’a gönder',
  difficulty: 'zor',
  concepts: ['form.rhf-register', 'form.rhf-errors', 'query.useMutation', 'fetch.error-handling'],
  files: ['CommentForm.tsx'],
  hints: [
    'Alan doğrulaması başarısızsa ağa gitme; hata yanıtında da kullanıcının yazısı kalmalı.',
    'TanStack Query `useMutation` ile yazma isteğini yönet; `fetch` cevabında `response.ok` durumunu kontrol et.',
    "`handleSubmit` callback'inde `mutateAsync(values)` bekle; başarılı dalda `reset()`, hata/pending/success durumlarında uygun mesaj ve düğme durumu kullan.",
  ],
})
