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
    'Önce endpoint yollarını ve parametrelerini eski sayfalardan listele.',
    'Her fonksiyon için uygun Movie, MovieDetails, Genre ve Paginated tiplerini kullan.',
    'getMovieDetails için append_to_response=credits,videos; discover için with_genres; search için query gönder.',
  ],
})
