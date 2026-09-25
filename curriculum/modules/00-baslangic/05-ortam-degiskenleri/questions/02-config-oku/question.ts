import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Ayarları güvenle oku',
  difficulty: 'orta',
  concepts: ['tooling.env', 'ts.optional-nullable', 'js.optional-chaining'],
  files: ['config.ts'],
  hints: [
    'Önce token’ı oku ve `trim()` ile boşluklarını at. Boşsa (`!token`) hemen `throw new Error(...)`.',
    'Başlık için `??` yetmez: `"   "` de boş sayılmalı. Önce trim, sonra `|| "Sinema"` düşün.',
    'Sayfa boyutu: `Number(env.VITE_PAGE_SIZE)` → geçersizse `NaN`. `Number.isInteger(x) && x > 0` değilse 20 kullan.',
  ],
})
