import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kırmızı çizgi ama çalışıyor?',
  difficulty: 'kolay',
  concepts: ['tooling.type-check', 'tooling.vite'],
  question: `\`App.tsx\` içinde şu satır var ve editör altını kırmızıyla çiziyor:

\`\`\`ts
const title: string = undefined
\`\`\`

\`pnpm dev\` açıkken tarayıcıda ne olur, \`pnpm build\` dediğinde ne olur?`,
  options: [
    {
      text: 'Tarayıcıda sayfa çalışır; `pnpm build` tip hatasıyla durur',
      correct: true,
      explanation:
        'Doğru. Vite tipleri kontrol etmeden siler, sayfa çalışır. build script’i önce `tsc -b` çalıştırır; tip hatası olduğu için `vite build` hiç başlamaz.',
    },
    {
      text: 'Tarayıcıda hata ekranı çıkar; build de durur',
      explanation:
        'Vite dev sunucusu tip hatası yüzünden hata göstermez; sadece söz dizimi (syntax) hatalarında durur.',
    },
    {
      text: 'İkisi de çalışır; tip hataları sadece uyarıdır',
      explanation:
        'Editörde uyarı gibi görünse de `tsc` hata koduyla çıkar ve `&&` sonrası build çalışmaz.',
    },
    {
      text: 'Vite hatayı otomatik düzeltir',
      explanation: 'Hiçbir araç tip hatasını senin yerine düzeltmez; sadece raporlar.',
    },
  ],
})
