Kişisel koleksiyon ekranında ürünleri bul, sepete ekle ve sipariş tutarını güncel gör. Katalog filtresi kullanıcının sepetini değiştirmemeli.

## Gereksinimler

- DummyJSON ürün kataloğundan ürünler gösterilir; ada göre arama ve kategori seçimi çalışır.
- Ürün sepete eklenebilir/çıkarılabilir ve miktarı değiştirilebilir.
- Sepet toplam tutarı her ekleme, çıkarma ve miktar değişiminde güncellenir.
- Arama veya kategori filtresini değiştirmek sepet içeriğini ve miktarları korur.
- Yükleme, hata ve boş sonuç durumları anlaşılır, erişilebilir biçimde gösterilir.
- Uygulama içinde kişisel koleksiyon ekranına gidilebilmelidir.

## Örnek

İki ürünü sepete ekle ve birinin miktarını artır. Kategori filtresini değiştir: sepet satırları ve toplam aynı kalır.

## Sözleşme

- Proje dosyaları: `projects/atolye/src/kisisel-koleksiyon/`
- Ekran uygulamadan açılabilir olmalı.
- Ürün kaynağı gerçek DummyJSON `/products` verisidir.

## Kısıtlar

- Ürün verisi ile sepet seçimi ayrı yaşam döngülerine sahip olmalıdır.
