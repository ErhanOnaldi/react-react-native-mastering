import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorum kuralları',
  difficulty: 'orta',
  concepts: ['zod.refine', 'form.rhf-errors', 'fetch.error-handling'],
  files: ['ReviewPanel.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Başlık ve metin ayrı ayrı dolu olsa bile birlikte yeterince açıklayıcı olmayabilir; ikisini birlikte değerlendiren bir kural düşün.',
    'Doğrulama kütüphanenin tek alan kurallarının yanında, birden fazla alanı birlikte kontrol eden bir kural biçimi de var.',
    'Sunucu hata döndürünce formu sıfırlama; yalnızca başarılı gönderimden sonra alanları temizle ve açık bir başarı mesajı göster.',
  ],
})
