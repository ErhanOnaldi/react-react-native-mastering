import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yeşil davranışı koruyarak sadeleştir',
  difficulty: 'orta',
  concepts: ['arch.refactoring', 'ts.optional-nullable', 'js.string-formatting'],
  files: ['describeMovie.ts', 'formatMovieYear.ts'],
  hints: [
    'Önce davranış testlerinin zaten geçtiğini gör.',
    'Her dalda tekrar edilen yıl üretimini bir kez hesapla.',
    'Koşullar yalnız etiket seçsin; `release_date` okuma ve başlık biçimlendirme ortak kalsın.',
  ],
  rubric: [
    'Yıl hesaplaması bir yerde yapılır; üç dala kopyalanmaz.',
    'Etiket seçimi açık ve tüm Kind seçeneklerini kapsar.',
    'Davranış, boş tarih dahil, refactor öncesiyle aynıdır.',
  ],
})
