import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Eser detayı ve bağımlı yazar verisi',
  difficulty: 'zor',
  concepts: [
    'router.params',
    'query.query-options',
    'query.dependent',
    'zod.api-validation',
    'ts.optional-nullable',
    'fetch.error-handling',
  ],
  project: 'kitaplik',
  focusFiles: ['src/app/routes.tsx', 'src/features/books/pages/WorkPage.tsx'],
  reviewFiles: ['src/features/books/**/*.{ts,tsx}', 'src/app/routes.tsx'],
  rubric: [
    'URL kimliği query key içinde mi; başka esere geçince yeni veri geliyor mu?',
    'Open Library cevapları Zod ile doğrulanıp açıklamanın iki biçimi tek UI tipine çevriliyor mu?',
    'Yazar isteği eser verisinden sonra ve ancak yazar anahtarı varsa atılıyor mu; yazar 404 ayrı ele alınıp eser ekranı korunuyor mu?',
    'Kapak id’si pozitif değilse kırık görsel yerine yer tutucu var mı?',
    '404 ile geçici sunucu/ağ hatası ayrılıyor; yeniden deneme sorguyu tekrar çalıştırıyor mu?',
  ],
  hints: [
    'Önce eseri `workId` içeren query key ile getir; arama şeması gibi eser cevabını da modele dönüştür.',
    'Yazar anahtarını eser cevabından çıkar. Ayrı query için `enabled: Boolean(authorId)` kullanabilir veya eser sorgusundan sonra hatayı yerel olarak yakalayabilirsin.',
    'Eser hatasında 404’ü ayrı göster; geçici hatada `query.refetch()` çağıran “Tekrar dene” butonu koy. Kapak için `id > 0` kontrolü yap.',
  ],
})
