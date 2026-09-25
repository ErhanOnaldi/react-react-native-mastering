import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema acı günlüğünü yaz',
  difficulty: 'orta',
  concepts: ['fetch.basics', 'fetch.loading-states', 'react.useEffect.deps', 'router.navigation'],
  project: 'sinema',
  focusFiles: ['NOTES.md'],
  reviewFiles: ['NOTES.md'],
  rubric: [
    'En az üç gözlem somut adımlar ve görülen istek/ekran davranışıyla yazılmış',
    'Geri navigasyonda tekrar arama isteği ve cache yokluğu doğru ayrılmış',
    'Dört sayfadaki loading/error tekrarı örneklerle gösterilmiş',
    'Detay id değişiminde eski film kalma hatası ve eksik dependency kaydedilmiş',
    'StrictMode geliştirme istekleri ile production benzeri sayım karıştırılmamış',
  ],
  hints: [
    '`/search?q=Matrix` → film detayı → geri akışını Network sekmesinde izle.',
    'Her gözlem için nasıl tekrarlanır, gördüğün sonuç ve muhtemel nedeni yaz.',
    'Loading/error tekrarı, favori başına detay isteği ve `/movie/:id` değişimindeki eski başlığı ayrı maddeler yap.',
  ],
})
