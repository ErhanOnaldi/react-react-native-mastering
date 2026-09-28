import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema’ya Vitest kapısı kur',
  difficulty: 'orta',
  concepts: ['test.vitest-basics', 'test.aaa', 'test.matchers', 'js.string-formatting'],
  project: 'sinema',
  focusFiles: ['vite.config.ts', 'package.json', 'src/shared/lib/format.test.ts'],
  reviewFiles: ['vite.config.ts', 'package.json', 'src/shared/lib/format.test.ts'],
  hints: [
    'Önce yapılandırma, komut ve davranış testlerinin projede hangi dosyalarda yaşadığını bul.',
    'Vite ayarındaki `test` alanı için `defineConfig` import’unu `vitest/config` üzerinden yap.',
    '`environment: "jsdom"` ve `globals: false` ayarla; `package.json` içine `vitest run` script’i ekle.',
    '`formatVote(8)` için `"8.0"`, `formatVote(0)` için `"Henüz oy yok"`, boş tarih için `""` bekleyen testler yaz.',
  ],
  rubric: [
    'Testler girdi ve beklenen çıktıyı açıkça adlandırıyor; AAA akışı okunuyor.',
    'Tam sayı puanı, henüz oy verilmemiş film ve eksik tarih gibi gerçek TMDB sınırlarını kapsıyor.',
    'Test dosyaları birbirinden bağımsız; elle test sırası ayarı gerektirmiyor.',
  ],
})
