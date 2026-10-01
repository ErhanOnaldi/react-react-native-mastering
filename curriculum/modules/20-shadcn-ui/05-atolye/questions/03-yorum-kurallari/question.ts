import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yorum kuralları',
  difficulty: 'orta',
  concepts: [
    'zod.refine',
    'form.rhf-errors',
    'fetch.error-handling',
    'shadcn.components',
    'form.a11y',
  ],
  files: ['ReviewPanel.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Üç ayrı aşamayı bul: alanların tekil zorunluluğu, iki alanın toplam kuralı ve sunucu yanıtı. Alanların ikisi de kendi etiketiyle kalmalı.',
    'Zod `.refine()` ile alanlar arası kural kurabilir; alanları FormField, FormLabel, FormControl ve FormMessage parçalarıyla bağla.',
    'Şemaya 15 karakter toplamı koşulu ekle. Mutation reddedilince alanları tut; yalnız başarıda `reset()` çağır.',
    'İlk hata ve sonraki başarıyı arka arkaya dene; eski hata metni başarıdan sonra ekranda kalmasın.',
  ],
  rubric: [
    'Başlık ve yorum alanları shadcn FormField/FormItem/FormLabel/FormControl/FormMessage parçalarıyla kurulur.',
    'Başlıkta Input, yorumda Textarea kullanılır; etiket ve doğrulama mesajı doğru kontrole bağlanır.',
    'Sunucu hatasında girilen alan değerleri korunur; form yalnız başarılı gönderimde temizlenir.',
  ],
})
