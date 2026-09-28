import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Test beklentilerini karşıla',
  difficulty: 'kolay',
  concepts: ['tooling.platform', 'test.vitest-basics', 'test.reading-results'],
  files: ['formatRuntime.ts'],
  hints: [
    'Test dosyasındaki dört ayrı `it` bloğunu oku; hangi girdilerin hangi özel çıktıları beklediğini gör.',
    'Saat sayısını `Math.floor(minutes / 60)` ile, kalan dakikayı ise mod operatörü `minutes % 60` ile hesaplayabilirsin.',
    'Özel durumları kontrol et: `minutes <= 0` için `"0 dk"`, `hours === 0` için `${minutes} dk`, `remaining === 0` için `${hours} sa`.',
    'Hem saat hem dakika varsa araya tek bir boşluk koymayı unutma: `${hours} sa ${remaining} dk`.',
  ],
})
