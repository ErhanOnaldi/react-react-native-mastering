Favori id'leri sayfa yenilenince kaybolmamalı. `useLocalStorage`, state benzeri bir değer döndürürken değişiklikleri tarayıcının kalıcı alanına da yazsın.

## Gereksinimler

- Kayıt yoksa başlangıç değeri döner.
- Saklı JSON varsa ilk render'da okunur.
- Saklı değer bozuk JSON ise başlangıç değeri kullanılır.
- Setter doğrudan yeni değer alabilir.
- Setter önceki değerden yeni değer üreten fonksiyon da alabilir.
- Değişiklik hem hook state'ine hem `localStorage` içine yazılır.

## Örnek

`localStorage["favoriler"] = "[550]"` iken `useLocalStorage<number[]>("favoriler", [])` ilk değeri `[550]` verir. Setter ile `[550, 27205]` yazılınca storage değeri `"[550,27205]"` olur.

## Sözleşme

- Dosya ve export: `useLocalStorage.ts` → `useLocalStorage<T>(key: string, initial: T)`
- Dönüş: `[value, setValue]`
- İkinci tuple değeri doğrudan yeni değer veya önceki değeri alan bir güncelleme fonksiyonunu kabul eder.
