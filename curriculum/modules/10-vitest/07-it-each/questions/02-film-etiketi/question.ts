import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film kartı etiketini üret',
  difficulty: 'orta',
  concepts: ['test.each', 'js.string-formatting', 'ts.object-types'],
  files: ['movieLabel.ts'],
  hints: [
    'Başlık ve tarih iki farklı kaynaktan geliyor; önce başlığı kırp.',
    'Boş tarihte yalnızca başlığı döndür. Dolu tarihte ilk dört karakter yılı verir.',
    'Dolu tarih için `${title.trim()} (${releaseDate.slice(0, 4)})` biçimini kullan.',
  ],
})
