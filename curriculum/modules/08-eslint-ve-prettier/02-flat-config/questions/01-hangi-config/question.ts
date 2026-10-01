import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Dosya eşleşmesini oku',
  difficulty: 'kolay',
  concepts: ['tooling.eslint-config', 'tooling.eslint'],
  question: `Bu flat config katmanına hangi dosyalar eşleşir?

\`\`\`js
{
  files: ['src/**/*.ts'],
  rules: { 'no-unused-vars': 'error' },
}
\`\`\``,
  options: [
    {
      text: '`src` içindeki `.ts` dosyaları, alt klasörler dâhil.',
      correct: true,
      explanation: '`**/` alt klasörlerle eşleşir, `.ts` uzantısı ise `.tsx` dosyalarını kapsamaz.',
    },
    {
      text: 'Yalnızca `src` klasörünün kökündeki `.ts` dosyaları.',
      explanation: '`**/` alt klasörlerdeki dosyaları da kapsar.',
    },
    {
      text: '`src` içindeki `.ts` ve `.tsx` dosyaları.',
      explanation: 'Desendeki uzantı yalnızca `.ts`; `.tsx` ayrı bir uzantıdır.',
    },
    {
      text: 'Projedeki bütün `.ts` dosyaları, `src` dışındakiler dâhil.',
      explanation: 'Desen `src/` ile başladığı için başka klasörlerle eşleşmez.',
    },
  ],
  explanation: '',
})
