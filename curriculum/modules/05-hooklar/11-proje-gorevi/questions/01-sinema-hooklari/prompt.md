Sinema projesinde arama ve ağ durumu için ortak hook sözleşmesini kur. Bu modülde gerçek TMDB sayfaları henüz eklenmiyor; amaç ileride kullanılacak public hook'ları hazırlamak ve mevcut arama alanını gecikmiş değerle bağlamak.

## Gereksinimler

- Arama alanı son yazılan değeri kısa bir beklemeden sonra kullanır; her tuşta anında yeni sonuç üretmez.
- Kalıcı değer hook'u favori id'lerini sayfa yenilemesinden sonra da saklayabilir.
- Ağ hook'u `null` URL'de istek atmaz.
- Ağ hook'u başarılı JSON cevabını `success`, HTTP hatasını `error` olarak döndürür.
- URL değişimi veya unmount sırasında önceki istek ekrana yazamaz.
- TMDB istekleri `Authorization: Bearer ${import.meta.env.VITE_TMDB_TOKEN}` başlığıyla gider.
- Mevcut statik film listesi ve Modül 4 UI yapısı korunur.

## Örnek

`useDebounce("M", 20)` ilk render'da `"M"` döndürür; değer `"Matrix"` olunca 20 ms dolmadan eski değeri, süre dolunca `"Matrix"` değerini verir. `useFetch<T>(null)` ise `{ status: "idle" }` döndürür ve ağ isteği atmaz.

## Sözleşme

- `src/hooks/useDebounce.ts` → named export `useDebounce<T>(value: T, delay: number): T`
- `src/hooks/useLocalStorage.ts` → named export `useLocalStorage<T>(key: string, initial: T)`
- `src/hooks/useFetch.ts` → named export `useFetch<T>(url: string | null): RemoteData<T>`
- `RemoteData` tipi mevcut `src/lib/remote-data.ts` dosyasından kullanılmalı.
- `src/App.tsx` arama alanı gecikmiş değeri kullanmalı; boş aramada statik liste korunmalı.

## Kısıtlar

- Bu görevde Modül 7'deki gerçek TMDB sayfalarını kurma.
- Dosya yolları ve export adları sonraki modüllerin sözleşmesidir.
