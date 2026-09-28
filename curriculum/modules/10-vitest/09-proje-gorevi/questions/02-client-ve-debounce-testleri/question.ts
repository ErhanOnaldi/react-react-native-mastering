import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'API client ve debounce testlerini yaz',
  difficulty: 'zor',
  concepts: [
    'test.mocks',
    'test.fake-timers',
    'test.render-hook',
    'arch.api-client',
    'arch.api-error',
    'react.useEffect.cleanup',
  ],
  project: 'sinema',
  focusFiles: ['src/shared/api/tmdb-client.test.ts', 'src/hooks/useDebounce.test.ts'],
  reviewFiles: ['src/shared/api/tmdb-client.test.ts', 'src/hooks/useDebounce.test.ts'],
  hints: [
    'Ağ ve saat iki ayrı dış sınırdır; senaryoları bu ayrımı gösterecek şekilde kur.',
    'Client testinde ağ sınırına `vi.fn` yerleştir; hook testinde gerçek 500 ms bekleme.',
    '`vi.stubGlobal("fetch", fake)` ile URL ve `Headers` içindeki Bearer değerini oku. `renderHook` sonucunu `act` içinde ilerletilen fake timer’dan önce ve sonra denetle.',
    'İkinci sayfa için URL’de `page=2`; 404 için `ApiError.status=404`; debounce için 499 ms’de eski, 500 ms’de yeni değer bekle. Temizlikte global fetch ve timer’ı geri al.',
  ],
  rubric: [
    'Client testleri URL, Bearer, başarılı veri ve ApiError alanlarını gözlenen sözleşme olarak ölçüyor.',
    'Debounce testi son değişimden başlayan süreyi ve eski timer cleanup davranışını ölçüyor.',
    'Mock ve fake timer temizliği her testten sonra yapılıyor; test sırası sonucu değiştirmiyor.',
  ],
})
