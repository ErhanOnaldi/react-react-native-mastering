import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kart etiketleri ve callback tipleri',
  difficulty: 'orta',
  concepts: ['ts.functions', 'js.array-methods'],
  files: ['cardLabels.ts'],
  hints: [
    'Diziyi dönüştürürken her eleman için yılı belirleyip başlıkla birleştirmeyi düşün.',
    'Parametrede `fallback = "Tarih yok"` varsayılanı tanımlayıp `.map()` callback’i içinde tarih boşluğunu kontrol edebilirsin.',
    'İskelet: `export type MovieLabelInput = { title: string; release_date: string; }; export function cardLabels(movies: MovieLabelInput[], fallback = "Tarih yok"): string[] { return movies.map(m => `${m.title} · ${m.release_date ? m.release_date.slice(0, 4) : fallback}`); }`',
    'Callback parametresine açıkça `any` tipi yazmaktan kaçın; `movies` dizisi tipli olduğu için callback parametresinin tipi otomatik olarak çıkarılır.',
  ],
})
