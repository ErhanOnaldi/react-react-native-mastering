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
    'Tarayıcıda sayfalar arasında gezinirken Network sekmesini ve bileşenlerin mount/unmount davranışlarını inceleyerek kanıt toplamalısın.',
    'Her sorun için dört parçalı şablonu (nasıl tekrarlanır, ne görüldü, olası neden, kullanıcı etkisi) izle; dosya yollarını açıkça belirt.',
    '`### 1. Geri Navigasyonda Tekrar İstek` başlığı altında `/search?q=Matrix` sayfasından detaya gidip geri dönüldüğünde unmount olan bileşenin state’i kaybetmesini ve effect’in tekrar çalışmasını açıkla.',
    'Geliştirme ortamında React `StrictMode` nedeniyle effect’lerin iki kez çalışmasını üretim ortamındaki gerçek istek tekrarıyla karıştırma; notlarında bu farkı belirt.',
  ],
})
