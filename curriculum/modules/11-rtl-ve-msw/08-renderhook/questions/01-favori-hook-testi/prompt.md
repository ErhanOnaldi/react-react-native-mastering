## Sorun
Bileşene yerleştirmeden önce favori hook’unun ekle/çıkar sözleşmesini sınamak istiyorsun. Hook’u normal fonksiyon gibi çağırmak React kurallarını bozar.

## Görev
`@impl/useFavoriteIds` için `renderHook` testi yaz. Başlangıç boş olsun; `act` içinde 550’yi ekle, tekrar ekleyince tek kopya kaldığını doğrula. Sonra 550’yi çıkar ve listenin boşaldığını doğrula.

## Örnek
`[] → toggle(550) → [550] → toggle(550) → []`. Farklı id eklediğinde sıralama ekleme sırası olsun.
