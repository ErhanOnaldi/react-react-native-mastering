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
    'Boş puan ve yorumun isteğe dönüşmemesi için doğrulama ile alan hataları nerede birleşmeli?',
    'Puan için `<FormControl><RadioGroup aria-label="Puan" value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>…</RadioGroup></FormControl>`. Her öğe `<RadioGroupItem value="3" aria-label="3 yıldız" />`.',
    '`useForm` + `zodResolver` ile şemayı bağla; Zod 4 `error` parametresi Türkçe mesajları üretir. `<FormControl><Textarea {...field} /></FormControl>` ve `<FormMessage />` kullan; FormControl tek çocuğuna id ve hata ilişkisini aktarır.',
  ],
  rubric: [
    'ReviewForm kopyalanmış Form/FormField/FormItem/FormLabel/FormControl/FormMessage parçalarını kullanıyor; elle yazılmış id veya aria-describedby kalmamış.',
    'Puan seçimi Radix RadioGroup: adı olan bir radiogroup, yön tuşlarıyla çalışıyor; değer string ↔ number dönüşümü tek yerde.',
    'Şema mesajları Türkçe ve Zod 4 `error` parametresiyle yazılmış; mutation (DummyJSON) akışı ve başarı/hata durumları korunmuş.',
  ],
})
