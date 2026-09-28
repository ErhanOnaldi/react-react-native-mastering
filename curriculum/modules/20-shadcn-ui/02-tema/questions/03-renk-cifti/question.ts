import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tema bekçisi: zayıf renk çiftleri',
  difficulty: 'orta',
  concepts: ['shadcn.theming', 'tailwind.theme', 'ts.record', 'js.string-formatting'],
  files: ['contrastPairs.ts'],
  hints: [
    'İlk fonksiyon için normal ve yüzde biçimindeki lightness değerlerini aynı 0–1 ölçeğinde temsil et.',
    "Regex ile ilk sayıyı yakalayabilir, `%` bulunduğunda değeri 100'e bölebilirsin.",
    '`Object.entries(tokens)` içinde `-foreground` ile bitenleri dolaş; `--foreground` için `--background` yüzeyini özel eşleştir.',
    'Eş yüzey yoksa atla; `Math.abs(surfaceL - textL) < minGap` olduğunda rol adını sonuçlara ekle.',
  ],
})
