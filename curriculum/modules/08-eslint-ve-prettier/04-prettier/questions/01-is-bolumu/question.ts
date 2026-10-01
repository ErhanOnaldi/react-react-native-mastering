import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi araç hangi işi yapar?',
  difficulty: 'kolay',
  concepts: ['tooling.prettier', 'tooling.eslint', 'react.useEffect.deps'],
  question: `Sinema'da Prettier ayarlarında \`singleQuote: true\` ve \`semi: false\` var. Şu dosyada \`format --write\` çalıştırılırsa ne değişir?

\`\`\`ts
const title = "Dövüş Kulübü";
export const heading = title;
\`\`\``,
  options: [
    {
      text: 'Tırnak tek tırnağa döner ve noktalı virgül kalkar; değişken adları ve değer aynı kalır.',
      correct: true,
      explanation: 'Bu seçenekler görünüşü değiştirir; `format --write` dosyaya bu biçimi yazar.',
    },
    {
      text: 'Prettier `heading` değerini `Dövüş Kulübü` metniyle değiştirir.',
      explanation:
        'Formatter değişkenleri çözüp yerine değer yazmaz; yalnızca kod biçimini düzenler.',
    },
    {
      text: 'Prettier yalnızca terminalde yeni bir biçim önerir; dosyayı değiştirmez.',
      explanation:
        '`--write` dosyayı değiştirir; dosyaya dokunmayan kontrol seçeneği `--check`tir.',
    },
    {
      text: 'Prettier noktalı virgülü korur; `semi: false` TypeScript derleyicisine yöneliktir.',
      explanation:
        '`semi` Prettier biçim tercihidir; `false` satır sonundaki noktalı virgülün yazılmamasını seçer.',
    },
  ],
  explanation: '',
})
