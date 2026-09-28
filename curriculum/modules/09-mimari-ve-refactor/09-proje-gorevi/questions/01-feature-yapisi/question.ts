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
    'İlk taşıyacağın dosyada hangi feature’ın sahibi olduğunu, hangisinin gerçek ortak kod olduğunu belirle.',
    'Feature kodunu kendi alanında, birden çok kullanıcıya ait helper’ları shared altında topla.',
    'TypeScript 6 için `paths` hedefini `"@/*": ["./src/*"]` yap; Vite `resolve.alias` ile aynı mutlak src kökünü göster.',
    'Her taşıma grubunda eski importları güncelle ve davranışları tekrar gözden geçir; alias bağımlılık yönünü düzeltmez.',
  ],
})
