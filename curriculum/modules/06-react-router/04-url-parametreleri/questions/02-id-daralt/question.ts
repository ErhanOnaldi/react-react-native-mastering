import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film id’sini güvenle daralt',
  difficulty: 'kolay',
  concepts: ['router.params', 'ts.narrowing'],
  files: ['parseMovieId.ts'],
  hints: [
    'URL değeri `undefined`, boş metin veya rakam dışında karakter içerebilir; önce hangi biçimleri kabul edeceğini listele.',
    '`/^\\d+$/` ile karakterleri denetle, ardından `Number` dönüşümü ve `Number.isSafeInteger` kontrolü uygula.',
    'Geçerli sayı pozitif olmalı. Her başarısız koşulda `null`, yalnız tüm koşullar geçince sayıyı döndür.',
  ],
})
