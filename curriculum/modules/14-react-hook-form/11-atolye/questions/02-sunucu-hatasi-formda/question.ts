import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sunucu hatası formda',
  difficulty: 'orta',
  concepts: ['form.rhf-errors', 'form.rhf-register', 'fetch.error-handling'],
  files: ['RatingForm.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Hata durumunda ekranda hangi bilginin kaybolmaması gerekiyor: seçilen puan mı, yoksa yalnızca bir durum mesajı mı?',
    'Formu sıfırlamak yalnızca sunucunun isteği kabul ettiği durumda doğru bir davranış.',
    'İstek cevabını kontrol et: başarısızsa hata durumunu göster ve `reset()`’e hiç gitme; başarılıysa `reset()` çağır.',
  ],
})
