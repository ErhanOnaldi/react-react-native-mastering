import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Arama, sayfalama ve kirli veri',
  difficulty: 'zor',
  concepts: [
    'router.search-params',
    'query.query-options',
    'query.keys',
    'query.pagination',
    'zod.api-validation',
    'zod.transform',
    'fetch.query-params',
    'fetch.error-handling',
    'ts.api-types',
    'react.lists-keys',
    'a11y.basics',
  ],
  project: 'kitaplik',
  focusFiles: ['src/app/routes.tsx', 'src/app/providers.tsx'],
  reviewFiles: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}'],
  rubric: [
    'Open Library’ye giden kod (URL kurma, hata, doğrulama) tek bir yerde mi; bileşenler fetch ve ham API alan adlarını (author_name, cover_i) bilmiyor mu?',
    'API cevabı Zod ile doğrulanıp uygulamanın kendi modeline dönüştürülüyor mu; eksik alanlar kapıda null/boş diziye çevriliyor mu?',
    'Query key’leri tek bir yerde (queryOptions / key factory) tanımlı ve key’de q ile page birlikte mi?',
    'URL tek doğruluk kaynağı mı: q ve page’in URL dışında bir kopyası (useState, store) yok mu; bozuk page güvenle okunuyor mu?',
    'Loading, error (Tekrar dene), boş sonuç ve başarı durumları ayrı ve anlaşılır mı; hata mesajı kullanıcıya ne yapacağını söylüyor mu?',
    'Erişilebilirlik: arama kutusunun etiketi var, sonuçlar liste semantiğinde, pasif sayfalama kontrolü duyuruluyor (aria-disabled) mu?',
    'Bileşenler küçük ve tek sorumluluklu mu (form, liste, kart, sayfalama ayrı)?',
  ],
  hints: [
    'Sorgu URL’deyken aynı sayfa yenilendiğinde arama nasıl yeniden kurulmalı? Boş sorguda istek olmamalı.',
    'Veri katmanı için openLibraryGet → searchBooks → bookQueries.search() kurabilirsin. Sayfada useQuery ve keepPreviousData ile sayfa geçişini yönet.',
    'readSearchParams(searchParams) ile q/page oku; useQuery içinde enabled: q.length > 0 kullan. Retry varsayılanını createQueryClient içinde ayarla. Form gönderiminde trim edilmiş q değerini URL’ye taşı.',
  ],
})
