Render ekranı hesaplar; fetch dış sistemle senkronizasyon kurar. `useEffect` bu işin yeridir. `id` dependency'si, aynı bileşen başka bir film için kullanıldığında yeni isteği başlatır.

## Alternatif ve tuzak

`useMemo` veya `useCallback` isteği render için güvenli yapmaz. İstek, dış sistemle eşleştiği için effect içindedir.

## Sektörde ve sonra

Bu ilk örnekte `[]` tek film gösterimini düzeltir. Detay bileşeninde `id` değiştiğinde bu çözümün eksikliğini göreceksin.
