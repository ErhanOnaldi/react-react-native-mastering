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
    'Önce her hook’u bağımsız ekle ve proje testlerini çalıştır.',
    'Debounce timer’ını ve fetch controller’ını ayrı effect’lerde cleanup et.',
    '`useFetch<T>` success dalında `data: T` taşır; hata dalında mevcut `RemoteData` tipinin biçimini izle.',
  ],
})
