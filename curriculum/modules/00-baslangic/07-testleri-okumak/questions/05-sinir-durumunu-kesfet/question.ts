import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sınır durumunu testten keşfet',
  difficulty: 'orta',
  concepts: ['test.vitest-basics', 'js.string-formatting', 'test.reading-results'],
  files: ['truncateOverview.ts'],
  hints: [
    'Test sekmesini aç ve özellikle son iki testin başlıklarını oku: kesilen parçanın sonundaki boşluklar ve zaten üç noktayla biten metinler.',
    'Metin `maxLength` sınırından uzunsa `text.slice(0, maxLength)` ile kes; ardından sondaki boşlukları `trimEnd()` ile temizle.',
    "Eğer kesilen metin zaten `...` ile bitiyorsa (`endsWith('...')`) tekrar üç nokta ekleme; bitmiyorsa sonuna `...` iliştir.",
  ],
})
