import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Düzenleme penceresi',
  difficulty: 'orta',
  concepts: ['form.rhf-reset', 'zod.resolver', 'shadcn.components', 'form.a11y', 'a11y.focus'],
  files: ['EditDialog.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Açık pencere yeni props alabilir. Hangi kayıt değişimi formu sıfırlamalı, hangi render ise kullanıcının yazısını korumalı?',
    'RHF `reset`-i seçili kaydın `id` değerine bağla; Zod schema/resolver ile alan hatalarını üret. Alanları ortak Form parçalarıyla kur.',
    'Her alan için FormField → FormItem → FormLabel + FormControl(Input) + FormMessage sırasını kullan.',
    "Parent her render'da aynı kaydı yeni obje olarak verirse formu sıfırlama; değişen kayıt kimliğini izle.",
  ],
  rubric: [
    'Alanlar kopyalanmış shadcn Form, FormField, FormItem, FormLabel, FormControl, FormMessage ve Input parçalarıyla kurulur.',
    'Etiket, kontrol ve hata aynı alan grubunda kalır; FormControl gerçek Input öğesini sarar.',
    'Bir kayıt kimliği değiştiğinde alanlar yeni kayda göre sıfırlanır; aynı kayıt yeniden render edildiğinde kullanıcının yazısı silinmez.',
  ],
})
