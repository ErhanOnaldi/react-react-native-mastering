import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema yorum formu',
  difficulty: 'zor',
  concepts: [
    'form.rhf-controller',
    'form.rhf-register',
    'form.rhf-errors',
    'query.useMutation',
    'form.a11y',
  ],
  project: 'sinema',
  focusFiles: ['src/features/watchlists/ReviewForm.tsx'],
  reviewFiles: ['src/features/watchlists/ReviewForm.tsx'],
  hints: [
    '`ReviewForm` named export olsun; `postId` prop’unu al.',
    'Puan için `Controller`, metin için `register` kullan; her ikisini de zorunlu kıl.',
    'Mutation’da DummyJSON `/comments/add` isteği gönder, `response.ok` kontrol et ve `isPending` durumunu göster.',
  ],
  rubric: [
    'Form alanları görünür etiketli ve hatalar erişilebilir mi?',
    'Veri tipi domain tipinden Omit ile türetilmiş mi?',
    'Hata ve başarılı kayıt durumları kullanıcıya açıkça gösteriliyor mu?',
  ],
})
