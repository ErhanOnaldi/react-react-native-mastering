import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorumu DummyJSON’a gönder',
  difficulty: 'zor',
  concepts: ['form.rhf-register', 'form.rhf-errors', 'query.useMutation', 'fetch.error-handling'],
  files: ['CommentForm.tsx'],
  hints: [
    'Önce boş metni RHF `required` kuralıyla engelle.',
    'Mutation fonksiyonunda `POST /comments/add` ve JSON gövdesi kur; `response.ok` kontrol et.',
    '`mutateAsync` başarılı olunca reset; `isPending`, `isError`, `isSuccess` için görünür durumlar ekle.',
  ],
})
