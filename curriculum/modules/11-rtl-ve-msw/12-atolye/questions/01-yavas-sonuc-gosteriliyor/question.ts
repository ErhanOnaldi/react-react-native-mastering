import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yavaş sonuç gösteriliyor',
  difficulty: 'orta',
  concepts: ['react.race-conditions', 'react.useEffect.cleanup', 'test.msw-overrides'],
  files: ['MovieSearch.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Boş aramada görünür sonuçla ağ davranışının ikisini de düşün; daha önce başlayan istek ayrı bir sorun çıkarabilir.',
    'Bir `useEffect` cleanup’ı ile eski işi geçersiz kılabilir veya `AbortController` ile iptal edebilirsin.',
    'Query boşsa listeyi temizle ve fetch yapma; cleanup’ta yerel `active` bayrağını kapat, cevapta yalnız `active` iken state güncelle.',
  ],
})
