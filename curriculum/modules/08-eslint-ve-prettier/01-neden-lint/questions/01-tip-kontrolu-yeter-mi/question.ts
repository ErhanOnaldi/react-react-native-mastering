import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tip kontrolü neden yetmedi?',
  difficulty: 'kolay',
  concepts: ['tooling.eslint', 'tooling.type-check', 'react.useEffect.deps'],
  question:
    "`MovieDetailsPage` içinde `useEffect(..., [])` var ama içeride URL'den gelen `id` okunuyor. `tsc -b` geçti. En doğru yorum hangisi?",
  options: [
    {
      text: 'Tipler doğru olsa da effect yeni `id` için çalışmayabilir; Hook bağımlılık kuralı bunu işaretler.',
      correct: true,
      explanation:
        'Evet. TypeScript değerlerin tipini kontrol eder; effect’in hangi değişime tepki vereceğini tek başına doğrulamaz.',
    },
    {
      text: '`tsc -b` geçtiğine göre detay sayfası her zaman yeni filmi gösterir.',
      explanation: 'Tip doğruluğu çalışma zamanı senkronizasyonunu garanti etmez.',
    },
    {
      text: 'Sorun yalnızca kullanılmayan import’tur.',
      explanation:
        'Boş import ayrı bir temizlik sorunudur; eski film effect bağımlılığıyla ilgilidir.',
    },
    {
      text: 'Her render’da `fetch` çağırmak dependency sorununu çözer.',
      explanation:
        'Render içindeki yan etki tekrar tekrar istek atabilir; effect’i doğru bağımlılıklarla kurmalısın.',
    },
  ],
  explanation: '',
})
