Render ekranı hesaplar; fetch dış sistemle senkronizasyon kurar. `useEffect` bu işin yeridir. Buradaki tek istek testi StrictMode sarmalı olmayan örnek için geçerlidir. StrictMode geliştirmede effect yaşam döngüsünü fazladan sınar; genel uygulamada “daima tek ağ isteği” garantisi sanma. Sonraki soruda aynı deseni başka uç noktaya uygula.

## Alternatif ve tuzak

`useMemo` veya `useCallback` isteği render için güvenli yapmaz. İstek, dış sistemle eşleştiği için effect içindedir.

## Sektörde ve sonra

Bu ilk örnekte `[]` tek film gösterimini düzeltir. Detay bileşeninde `id` değiştiğinde bu çözümün eksikliğini göreceksin.
