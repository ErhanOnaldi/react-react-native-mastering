import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema yorum formunu shadcn parçalarıyla yeniden kur',
  difficulty: 'zor',
  concepts: [
    'shadcn.components',
    'form.rhf-controller',
    'form.a11y',
    'zod.resolver',
    'a11y.keyboard',
    'pattern.slot',
    'query.useMutation',
  ],
  project: 'sinema',
  focusFiles: [
    'src/components/ui/form.tsx',
    'src/components/ui/radio-group.tsx',
    'src/features/watchlists/ReviewForm.tsx',
    'src/features/watchlists/schemas.ts',
  ],
  reviewFiles: [
    'src/components/ui/form.tsx',
    'src/components/ui/radio-group.tsx',
    'src/features/watchlists/ReviewForm.tsx',
    'src/features/watchlists/schemas.ts',
  ],
  hints: [
    'Önce mevcut mutation ve durum mesajlarını koru; puan seçimi ile boş yorumun hangi kontrol olduğunu ayır.',
    'RHF `Controller` ile Radix `RadioGroup` bağla; radio value string, şema rating number olduğu için dönüşümü tek noktada yap. Zod 4 `error` mesajları kullan.',
    'Gruba `aria-label="Puan"` ver; her item için `value="3"` ve `aria-label="3 yıldız"` gibi açık değer/ad kullan. `FormControl` tek çocuğuna a11y özelliklerini geçir.',
    'Boş gönderim, yön tuşu, geçerli submit ve sunucu hata durumlarını sırayla dene; bu proje için gerekli alanları ayrıca kontrol et.',
  ],
  rubric: [
    'ReviewForm kopyalanmış Form/FormField/FormItem/FormLabel/FormControl/FormMessage parçalarını kullanıyor; elle yazılmış id veya aria-describedby kalmamış.',
    'Puan seçimi Radix RadioGroup: adı olan bir radiogroup, yön tuşlarıyla çalışıyor; değer string ↔ number dönüşümü tek yerde.',
    'Şema mesajları Türkçe ve Zod 4 `error` parametresiyle yazılmış; mutation (DummyJSON) akışı ve başarı/hata durumları korunmuş.',
  ],
})
