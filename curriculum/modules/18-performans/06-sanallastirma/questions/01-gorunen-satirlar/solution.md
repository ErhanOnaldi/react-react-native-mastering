## Neden böyle?
Virtualizer toplam yüksekliği korurken yalnız görünür indeksleri üretir. `getItemKey` film id'sine bağlanır; sıralama değişince aynı film yanlış satır state'iyle eşleşmez. Sabit 40 px satır bu giriş görevi için yeterlidir; farklı yüksekliklerde `measureElement` gerekir. Sanallaştırma filtre hesaplamasını azaltmaz.
