import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Tek TMDB client kur',
  difficulty: 'zor',
  concepts: [
    'arch.api-client',
    'arch.api-error',
    'fetch.headers-auth',
    'fetch.error-handling',
    'ts.generics',
  ],
  project: 'sinema',
  focusFiles: ['src/shared/api/tmdb-client.ts'],
  reviewFiles: ['src/shared/api/tmdb-client.ts', 'src/features/**/*.ts', 'src/features/**/*.tsx'],
  rubric: [
    'TMDB kökü, Bearer token, dil ve ortak HTTP hata dönüşümü shared/api/tmdb-client.ts içinde tek yerde.',
    'ApiError hem HTTP status hem TMDB status_code hem de okunabilir message taşır; 401/404 ekranları anlamlı tepki verir.',
    'Feature katmanı HTTP ayrıntısını tekrar etmiyor; mevcut kullanıcı akışları korunuyor.',
    'get<T> tip parametresinin runtime doğrulaması olmadığı açık; sahte bir doğrulama iddiası yok.',
  ],
  hints: [
    'Üçüncü dersteki ApiError örneğini proje sözleşmesine uyarla.',
    'URLSearchParams ile language ve params değerlerini kur; import.meta.env.VITE_TMDB_TOKEN başlığını ekle.',
    'response.ok false ise gövdeyi güvenli oku ve ApiError fırlat; başarıda JSON’u T olarak döndür.',
  ],
})
