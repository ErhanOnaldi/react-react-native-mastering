Film türü panelinde seçili seçenekleri sayan rozet, seçimlerle aynı anda değişmeli. `Temizle` sonrası eski sayı kalırsa kullanıcı filtrenin hâlâ açık olduğunu sanıyor.

## Gereksinimler

- Başlangıçta `Seçili tür: 0` görünür.
- Birden çok tür seçilebilir ve kaldırılabilir.
- Sayaç her seçimden hemen sonra güncel seçili tür sayısını gösterir.
- `Temizle` tüm seçimleri kaldırır ve sayacı sıfırlar.
- Checkbox'lar erişilebilir ad olarak tür adlarını kullanır.

## Örnek

Aksiyon ve Dram seç → `Seçili tür: 2`; Dram'ı kaldır → `Seçili tür: 1`; temizle → `Seçili tür: 0`.

## Sözleşme

- Dosya ve export: `GenreCounter.tsx` → `GenreCounter`
- Hazır veri: `genres.ts`
- Testler `Aksiyon`, `Dram`, `Komedi` checkbox'larını ve `Temizle` button'ını arar.
