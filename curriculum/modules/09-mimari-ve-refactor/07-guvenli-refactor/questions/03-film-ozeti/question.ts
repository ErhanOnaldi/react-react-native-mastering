import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yeşil davranışı koruyarak sadeleştir',
  difficulty: 'orta',
  concepts: ['arch.refactoring', 'ts.optional-nullable', 'js.string-formatting'],
  files: ['describeMovie.ts', 'formatMovieYear.ts'],
  hints: [
    'Hangi gözlenen değerlerin refactor öncesiyle aynı kalması gerekiyor?',
    'Saf tarih biçimleyici çıkarmak için yeni dosya ve export sözleşmesini kullan.',
    'Yıl hesabını bir kez üret; etiket seçimiyle ortak çıktı cümlesini ayır.',
    'Boş tarihi de taşı; yalnız normal tarihle aynı davranışı varsayma.',
  ],
  rubric: [
    'Yıl hesaplaması bir yerde yapılır; üç dala kopyalanmaz.',
    'Etiket seçimi açık ve tüm Kind seçeneklerini kapsar.',
    'Davranış, boş tarih dahil, refactor öncesiyle aynıdır.',
  ],
})
