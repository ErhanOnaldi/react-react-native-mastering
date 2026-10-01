## Neden böyle?

**Hata neden görünmüyordu?** Tablonun tipi `{ [level: string]: Badge }` idi: "her metin bir anahtar olabilir". Bu yüzden `hight` yazım hatası derlendi. `badgeFor(8.4)` çalışma anında `RATING_BADGES['high']`'ı aradı, bulamadı ve `undefined` döndü. Ekranda boş rozet bu yüzden görünüyordu. TypeScript sorunu görmedi, çünkü tip her anahtara izin veriyordu.

**`Record` anahtarları bağlar.** `Record<RatingLevel, Badge>` şu anlama gelir: "`'low'`, `'mid'` ve `'high'` anahtarlarının her biri için bir `Badge`". Tipi değiştirdiğin anda TypeScript `hight` satırını işaretler (`'hight' does not exist…`) ve eksik `high` anahtarını ister. Çalışma anında ortaya çıkan hata, derleme hatasına dönüşür.

**Asıl kazanç ileride.** Yarın `RatingLevel`'a `'masterpiece'` eklersen tablo hemen kırmızıya döner ve rozetini eklemen gereken yeri gösterir. Seviyeler ile tablo aynı kaynaktan beslenir.

**`Readonly` neden?** Rozet tablosu uygulamanın sabit ayarıdır. `Readonly` olmadan herhangi bir dosya `RATING_BADGES.low = …` yazıp tüm listedeki rozetleri değiştirebilir. `Readonly` yalnızca en üst seviyeyi kilitler; `RATING_BADGES.low.color = 'x'` hâlâ derlenir. Bunu da kilitlemek istersen `Badge` alanlarını `readonly` yapabilirsin.

**Sonraki adım.** 6. derste aynı tabloyu `satisfies` ile yazıp renklerin literal tiplerini de korumayı göreceksin.
