import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tip hatası mı test hatası mı?',
  difficulty: 'kolay',
  concepts: ['tooling.type-check', 'test.vitest-basics', 'test.reading-results'],
  question: `Kodunu çalıştırdığında terminal ekranında şu satırlar yer alıyor:

\`\`\`text
src/movieUtils.ts:5:21 - error TS2345: Argument of type 'undefined' is not assignable to parameter of type 'string'.
5   return text.trim()
               ~~~~~
\`\`\`

Bu çıktıyla ilgili olarak **hangisi doğrudur**?`,
  options: [
    {
      text: 'Bu bir TypeScript tip hatasıdır; Vitest mantıksal testleri henüz koşturulmamıştır.',
      correct: true,
      explanation:
        'Doğru. `error TSxxxx` ifadesi TypeScript derleyicisine (`tsc`) aittir. Tip denetimi geçilmeden kod mantıksal test aşamasına geçemez.',
    },
    {
      text: 'Vitest testleri başarısız olmuştur; `toBe` yerine `toEqual` kullanılmalıdır.',
      explanation:
        'Hayır. Çıktıda bir `AssertionError` veya test adı bulunmuyor; doğrudan TypeScript derleyici hatası raporlanmış.',
    },
    {
      text: 'Kod başarıyla derlenmiştir; sadece bir çalışma zamanı uyarısı (warning) verilmektedir.',
      explanation:
        'Hayır. `error TS2345` açıkça bir derleme hatasıdır (error). CI ve platformda görev tamamlanmış sayılmaz.',
    },
    {
      text: 'Fonksiyon `string` yerine `boolean` döndürdüğü için test patlamıştır.',
      explanation:
        'Hayır. Hata mesajı parametrenin `undefined` olabileceğini, oysa `trim` fonksiyonunun `string` beklediğini belirtmektedir.',
    },
  ],
})
