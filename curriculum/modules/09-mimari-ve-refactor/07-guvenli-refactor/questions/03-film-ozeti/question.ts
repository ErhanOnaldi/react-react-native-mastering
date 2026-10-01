import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Yeşil davranışı koruyarak sadeleştir',
  difficulty: 'orta',
  concepts: ['arch.refactoring', 'ts.optional-nullable', 'js.string-formatting'],
  files: ['describeMovie.ts', 'formatMovieYear.ts'],
  hints: [
    'Hangi gözlenen değerlerin refactor öncesiyle aynı kalması gerekiyor?',
    'Yeni tarih fonksiyonunun hem dolu hem boş girdide eski çıktıyı üretmesi gerekiyor.',
    'Taşıdığı kuralı `formatMovieYear` içinde uygula; `describeMovie` bu dışa aktarılan fonksiyonu kullansın.',
    'Etiketleri tek tabloda seçip, ortak cümleyi tür dallarından sonra bir kez kur.',
  ],
  rubric: [
    '`formatMovieYear` dolu ve boş tarih için doğru çıktıyı üretir.',
    '`describeMovie` yıl üretmek için `formatMovieYear` fonksiyonunu çağırır.',
    'Etiket seçimi üç Kind seçeneğini kapsar ve ortak çıktı biçimi tekrarlanmaz.',
    'Davranış, boş tarih dahil, refactor öncesiyle aynıdır.',
  ],
})
