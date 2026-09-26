import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Alias kimin için?',
  difficulty: 'orta',
  concepts: ['shadcn.setup', 'tooling.path-alias', 'tooling.vite-config', 'tooling.vite'],
  question: `\`shadcn add button\` sonrası \`src/components/ui/button.tsx\` oluştu ve içinde \`import { cn } from "@/shared/lib/cn"\` var. \`tsc -b\` hatasız geçiyor, editör de import'u buluyor. Ama \`pnpm dev\` açılınca Vite şu hatayı veriyor:

\`\`\`
Failed to resolve import "@/shared/lib/cn" from "src/components/ui/button.tsx"
\`\`\`

En olası eksik hangisi?`,
  options: [
    {
      text: '`vite.config.ts` içinde `@` için `resolve.alias` (ya da Vite 8’in `resolve.tsconfigPaths: true`) yok.',
      correct: true,
      explanation:
        'Doğru. `tsconfig` içindeki `paths` yalnızca TypeScript’e (ve shadcn CLI’a) söyler; Vite modülleri kendi çözümleyicisiyle bulur. `tsc` geçip Vite’ın patlaması tam bu ayrımın işaretidir.',
    },
    {
      text: '`tsconfig.app.json` içinde `paths` eksik.',
      explanation:
        'O eksik olsaydı `tsc -b` ve editör de import’u bulamazdı. Soruda ikisi de çalışıyor.',
    },
    {
      text: '`components.json` içindeki `style` alanı yanlış.',
      explanation:
        '`style` üretilen bileşenlerin görsel stilini seçer; çalışma zamanında import çözümlemesine etkisi yok.',
    },
    {
      text: '`tailwind.config.js` dosyası üretilmemiş.',
      explanation:
        'Tailwind v4 CSS merkezlidir (`@theme`); JS config dosyası gerekmez ve import çözümlemesiyle ilgisi yoktur.',
    },
  ],
})
