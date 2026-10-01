## Neden böyle?

Hook’u koşullu çağırmak React kurallarını bozar; `enabled` sorguyu açık veya kapalı tutarken hook çağrısı sabit kalır. `enabled` TypeScript’e query function içindeki id’nin bulunduğunu kanıtlamaz, bu yüzden fonksiyon içinde ayrıca kontrol edilir. `skipToken` sonraki bir seçenek olarak da kullanılabilir; manuel `refetch()` gerekiyorsa `enabled` düzeni daha uygundur.
