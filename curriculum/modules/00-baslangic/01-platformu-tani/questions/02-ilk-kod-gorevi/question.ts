import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film puanını biçimlendir',
  difficulty: 'kolay',
  concepts: ['tooling.platform', 'js.string-formatting'],
  files: ['formatVote.ts'],
  hints: [
    'Önce test sekmesini aç ve beklentileri incele: tam sayılar, küsuratlı sayılar ve sıfır puan durumu.',
    'Sayıları tek ondalık basamaklı metne çevirmek için `sayi.toFixed(1)` metodunu kullanabilirsin.',
    '`if (voteAverage === 0) return "Henüz oy yok"; return voteAverage.toFixed(1);`',
    'Tuzak: `Math.round(x * 10) / 10` tam sayılarda `"8.0"` yerine `"8"` üretir; testin beklediği `"8.0"` çıktısı için `toFixed(1)` gereklidir.',
  ],
})
