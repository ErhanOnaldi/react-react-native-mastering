Sinema’da favori butonuna iki kez basıldığında aynı film iki defa kaydedilmemeli. `@impl/favoriteStore` içindeki `addFavorite(id)` fonksiyonunun **dış etkisini** test et.

- `localStorage` içeriğini test öncesi temizle.
- `vi.spyOn` ile `setItem` çağrısını gözle: anahtar `favoriteIds` olmalı.
- `550` iki kez eklendiğinde saklanan JSON dizisi `[550]` olmalı.
- Spy’ı test sonunda geri yükle.

`vi.fn` sıfırdan fonksiyon üretir; `vi.spyOn` var olan `setItem` metodunun gerçek davranışını koruyarak çağrıyı izler.
