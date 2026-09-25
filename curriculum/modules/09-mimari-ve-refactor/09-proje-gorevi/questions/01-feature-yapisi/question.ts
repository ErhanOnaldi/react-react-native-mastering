import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema dosyalarını feature yapısına taşı',
  difficulty: 'orta',
  concepts: ['arch.feature-folders', 'arch.colocation', 'tooling.path-alias', 'tooling.tsconfig'],
  project: 'sinema',
  focusFiles: [
    'tsconfig.app.json',
    'vite.config.ts',
    'src/shared/lib/format.ts',
    'src/shared/lib/tmdb-image.ts',
  ],
  reviewFiles: [
    'src/features/**/*.ts',
    'src/features/**/*.tsx',
    'src/shared/**/*.ts',
    'src/shared/**/*.tsx',
    'tsconfig.app.json',
    'vite.config.ts',
  ],
  rubric: [
    'Movies, search ve favorites kodları kendi feature klasörlerinde; gerçekten ortak kod shared/ altında.',
    'Eski yolların tüm importları güncellenmiş ve aynı mantığın iki bağımsız kopyası bırakılmamış.',
    'TypeScript paths ve Vite resolve.alias aynı src/ köküne bakıyor; TS 6 için baseUrl kullanılmıyor.',
    'Ana sayfa, arama, detay, favoriler, filtre ve sayfalama davranışları taşımadan önceki gibi çalışıyor.',
  ],
  hints: [
    'Önce ortak format ve görsel yardımcılarını shared/lib altına taşı; her taşıma sonrası importları düzelt.',
    'Feature kodunu movies, search ve favorites altında topla; shared klasörünü yalnız gerçek ortaklık için kullan.',
    'tsconfig.app.json içinde "@/*": ["./src/*"]; vite.config.ts içinde resolve.alias ile aynı src/ adresi.',
  ],
})
