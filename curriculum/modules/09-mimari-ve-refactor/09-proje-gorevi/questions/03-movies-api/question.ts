import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Film endpointlerini adlandır',
  difficulty: 'zor',
  concepts: [
    'arch.feature-folders',
    'arch.api-client',
    'arch.separation-of-concerns',
    'fetch.query-params',
    'ts.api-types',
  ],
  project: 'sinema',
  focusFiles: ['src/features/movies/api/movies-api.ts', 'src/shared/api/tmdb-client.ts'],
  reviewFiles: [
    'src/features/movies/**/*.ts',
    'src/features/movies/**/*.tsx',
    'src/features/search/**/*.ts',
    'src/features/favorites/**/*.ts',
    'src/pages/**/*.tsx',
  ],
  rubric: [
    'Beş endpoint fonksiyonu ortak tmdbClient kullanıyor; token, kök URL ve HTTP hata kodu tekrar edilmiyor.',
    'Sayfalar ve hooklar endpoint yolunu bilmek yerine anlamlı film API fonksiyonlarını çağırıyor.',
    'Trend, tür filtresi, arama, detay, kadro, favoriler ve URL sayfalama davranışları korunuyor.',
    'UI, feature API ve shared HTTP sınırları anlaşılır; gereksiz soyutlama veya döngüsel import yok.',
  ],
  hints: [
    'Sayfa ve hook’ların ihtiyaç duyduğu film kaynaklarını ve URL seçimlerini listele.',
    'Film cevap tiplerini feature içindeki ortak tip dosyasında tanımla; endpoint fonksiyonlarını film feature’ına yakın tut.',
    'Trend, tür, arama, detay ve tür listesini ayrı named export’larla ortak client’a bağla; endpoint parametrelerini eşleştir.',
    'Detay cevabında credits/videos birlikte gelir; favorilerde detay kullanan akışı da bağlamayı unutma.',
  ],
})
