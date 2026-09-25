Sinema projesinde şu **named export**’ları oluştur:

- `src/hooks/useDebounce.ts` → `useDebounce<T>(value: T, delay: number): T`. Değer son değişimden `delay` ms sonra güncellensin; timer cleanup olsun.
- `src/hooks/useLocalStorage.ts` → `useLocalStorage<T>(key: string, initial: T)`. State benzeri tuple dönsün; saklı JSON’u başlangıçta oku, setter doğrudan değer veya updater fonksiyonu alıp hem state’i hem storage’ı güncellesin. Bozuk JSON’da başlangıç değerine dön.
- `src/hooks/useFetch.ts` → `useFetch<T>(url: string | null): RemoteData<T>`. `RemoteData` tipini mevcut `src/lib/remote-data.ts` dosyasından al. Null URL idle; URL loading → success/error. HTTP `!ok` hata olsun. TMDB için `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` başlığı ekle. URL değişimi ve unmount’ta `AbortController` ile iptal et.

`App.tsx` arama alanında `useDebounce` kullan; boş aramada statik listeyi koru. Bu modülde gerçek TMDB sayfalarını henüz kurma; onlar Modül 7’de.