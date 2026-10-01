import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Prettier ayar dosyasını oluştur',
  difficulty: 'kolay',
  concepts: ['tooling.prettier'],
  files: ['prettier-config.json'],
  hints: [
    'Önce JSON içinde metin, doğru/yanlış ve sayı değerlerinin nasıl yazıldığını ayır.',
    'Prettier seçenekleri string tırnağı, noktalı virgül ve satır genişliği hedefini belirler.',
    'Config dosyasına `parser`, `singleQuote`, `semi` ve `printWidth` anahtarlarını ekle.',
  ],
})
