import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema izleme listesi formu',
  difficulty: 'zor',
  concepts: [
    'form.rhf-register',
    'form.rhf-field-array',
    'form.rhf-errors',
    'form.a11y',
    'ts.omit',
    'ts.partial',
    'react.custom-hooks',
  ],
  project: 'sinema',
  focusFiles: [
    'src/features/watchlists/WatchlistForm.tsx',
    'src/features/watchlists/useWatchlists.ts',
    'src/features/watchlists/types.ts',
  ],
  reviewFiles: [
    'src/features/watchlists/WatchlistForm.tsx',
    'src/features/watchlists/useWatchlists.ts',
    'src/features/watchlists/types.ts',
  ],
  hints: [
    "Önce `Watchlist` domain tipini yaz; form değeri `Omit<Watchlist, 'id' | 'createdAt'>` olsun.",
    '`useWatchlists` içinde localStorage’dan oku ve eklemede yeni dizi kaydet; formda `register` ve `useFieldArray` kullan.',
    'Etiketler `{ value: string }` satırlarıdır; kaydetmeden önce boşları filtrele ve başarılı kayıttan sonra `reset` çağır.',
  ],
  rubric: [
    'Form alanları görünür etiketli ve hatalar erişilebilir mi?',
    'Veri tipi domain tipinden Omit ile türetilmiş mi?',
    'Hata ve başarılı kayıt durumları kullanıcıya açıkça gösteriliyor mu?',
  ],
})
