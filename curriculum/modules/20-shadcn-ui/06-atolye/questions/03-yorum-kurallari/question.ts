import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorum kuralları',
  difficulty: 'orta',
  concepts: ['zod.refine', 'form.rhf-errors', 'fetch.error-handling'],
  files: ['ReviewPanel.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Üç ayrı aşamayı bul: alanların tekil zorunluluğu, iki alanın toplam kuralı ve sunucu yanıtı.',
    "Zod `.refine()` ile alanlar arası kural kurabilir; RHF submit state'i ile başarı/hata metinlerini ayır.",
    'Şemaya 15 karakter toplamı koşulu ekle. Mutation reddedilince alanları tut; yalnız başarıda `reset()` çağır.',
    'İlk hata ve sonraki başarıyı arka arkaya dene; eski hata metni başarıdan sonra ekranda kalmasın.',
  ],
})
