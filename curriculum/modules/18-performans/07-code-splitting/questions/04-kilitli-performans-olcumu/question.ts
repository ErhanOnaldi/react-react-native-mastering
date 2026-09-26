import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Aynı sürümle ölç',
  difficulty: 'orta',
  concepts: ['tooling.lockfile', 'perf.code-splitting'],
  question:
    'Code splitting değişikliğinden önce ve sonra bundle boyutunu CI’da karşılaştırıyorsun. Ekipte iki farklı plugin sürümü çözülürse ölçüm güvenilmez. Hangi kurulum aynı çözümlenmiş sürümleri zorlar?',
  options: [
    {
      text: 'Commit’lenmiş `pnpm-lock.yaml` ile `pnpm install --frozen-lockfile`.',
      correct: true,
      explanation:
        'Doğru. Lockfile tam bağımlılık ağını sabitler; frozen kurulum manifest ile uyuşmazlığı da yakalar.',
    },
    {
      text: 'Sadece `package.json` içindeki `^` aralıklarını bırakıp her seferinde yeniden çözümlemek.',
      correct: false,
      explanation:
        'Sürüm aralığı farklı günlerde farklı sürümler seçebilir; ölçümde değişken yaratır.',
    },
    {
      text: 'Build çıktısını elle `node_modules` klasörüne kopyalamak.',
      correct: false,
      explanation: 'Derleme çıktısı bağımlılık çözümünü sabitlemez ve kurulum adımı yerine geçmez.',
    },
  ],
})
