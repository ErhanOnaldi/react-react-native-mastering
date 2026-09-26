import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tema bekçisi: zayıf renk çiftleri',
  difficulty: 'orta',
  concepts: ['shadcn.theming', 'tailwind.theme', 'ts.record', 'js.string-formatting'],
  files: ['contrastPairs.ts'],
  hints: [
    'Önce `oklchLightness`: bir düzenli ifade ile `oklch(` sonrasındaki ilk sayıyı ve olası `%` işaretini yakala.',
    '`Object.entries(tokens)` üzerinde dön; adı `-foreground` ile bitenleri al ve yüzeyin adını türet. `--foreground` için yüzey `--background`.',
    '`const role = name === "--foreground" ? "background" : name.slice(2, -"-foreground".length)`; yüzey yoksa atla, `Math.abs(fark) < minGap` ise `role`’ü ekle.',
  ],
})
