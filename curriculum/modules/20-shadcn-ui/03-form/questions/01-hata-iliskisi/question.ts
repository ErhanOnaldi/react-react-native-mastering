import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'FormControl’ün tek çocuğu',
  difficulty: 'orta',
  concepts: ['form.a11y', 'pattern.slot', 'shadcn.components'],
  question: `Yorum alanına bir karakter sayacı eklemek için kopyalanmış shadcn parçalarını şöyle düzenledin. Boş gönderimde "Yorum gerekli" mesajı ekranda görünüyor; ama ekran okuyucu textarea'ya gelince ne "Yorum" etiketini ne de hatayı duyuruyor. Neden?

\`\`\`tsx
<FormItem>
  <FormLabel>Yorum</FormLabel>
  <FormControl>
    <div className="relative">
      <Textarea {...field} />
      <span className="absolute right-2 bottom-2">{field.value.length}/500</span>
    </div>
  </FormControl>
  <FormMessage />
</FormItem>
\`\`\``,
  options: [
    {
      text: '`FormControl` bir Slot: `id`, `aria-invalid` ve `aria-describedby`’yi tek çocuğu olan `div`’e koyuyor; textarea hiçbirini almıyor.',
      correct: true,
      explanation:
        'Doğru. `FormLabel`’in `htmlFor`’u artık div’in id’sini gösteriyor, hata da div’e bağlı. `FormControl`’ü doğrudan `<Textarea>`’nın etrafına al, sayacı onun dışına (FormItem içine) taşı.',
    },
    {
      text: '`FormMessage` yalnızca `FormControl`’ün içinde çalışır; dışarı yazıldığı için bağ kopuyor.',
      explanation:
        '`FormMessage` `FormItem`’in Context’inden id’yi okur; `FormControl`’ün kardeşi olarak doğru yerde duruyor.',
    },
    {
      text: 'Sayaç `span`’i `aria-live` olmadığı için ekran okuyucu tüm alanı yok sayıyor.',
      explanation:
        '`aria-live` yalnızca değişen içeriğin duyurulmasıyla ilgilidir; etiket ve hata bağını etkilemez.',
    },
    {
      text: '`{...field}` spread’i `aria-invalid`’i ezdiği için hata duyurulmuyor.',
      explanation:
        '`field` yalnızca `name`, `value`, `onChange`, `onBlur`, `ref` taşır. Sorun, ARIA bağlarının hiç textarea’ya ulaşmaması.',
    },
  ],
})
