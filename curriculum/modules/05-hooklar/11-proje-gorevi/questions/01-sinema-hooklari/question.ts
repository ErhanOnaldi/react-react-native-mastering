import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Sinema hook sözleşmesini kur',
  difficulty: 'zor',
  concepts: [
    'react.custom-hooks',
    'react.useEffect.cleanup',
    'react.abort-controller',
    'ts.discriminated-union',
  ],
  project: 'sinema',
  rubric: [
    'App arama alanı useDebounce ile son değeri kullanıyor',
    'useFetch null URL ve hata durumlarını RemoteData ile ayırıyor',
    'Effect cleanup eski timer ve fetch isteğini temizliyor',
  ],
  reviewFiles: ['src/App.tsx', 'src/hooks/*.ts'],
  focusFiles: [
    'src/hooks/useDebounce.ts',
    'src/hooks/useLocalStorage.ts',
    'src/hooks/useFetch.ts',
    'src/App.tsx',
  ],
  hints: [
    'Önce her hook’u bağımsız ekle; sonra `App` aramasını yeni hook’a bağla.',
    'Debounce için timer cleanup, fetch için AbortController cleanup gerekir.',
    '`useFetch<T>` success dalında `data: T` taşır; error dalında mevcut `RemoteData` tipinin biçimini izle.',
    '`useLocalStorage` setter’ı React state setter’ı gibi updater fonksiyonu da kabul etmeli.',
  ],
})
