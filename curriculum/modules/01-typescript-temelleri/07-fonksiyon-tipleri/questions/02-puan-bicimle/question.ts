import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Varsayılan parametreli puan biçimlendirme',
  difficulty: 'kolay',
  concepts: ['ts.functions', 'js.string-formatting'],
  files: ['formatScore.ts'],
  hints: [
    'Parametrede varsayılan değer tanımlamayı ve sıfır durumunu öncelikli kontrol etmeyi düşün.',
    'Fonksiyon imzasında `digits = 1` kullanarak varsayılan değeri belirle ve `.toFixed(digits)` metodundan yararlan.',
    'İskelet: `export function formatScore(vote: number, digits = 1): string { if (vote === 0) return "Henüz oy yok"; return vote.toFixed(digits); }`',
    '`digits?: number` yazıp gövdede varsayılan değer atamazsan `.toFixed(undefined)` sıfır basamak kabul edebilir; parametreye doğrudan `digits = 1` ver.',
  ],
})
