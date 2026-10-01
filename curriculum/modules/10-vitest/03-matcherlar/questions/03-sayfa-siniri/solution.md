## Neden böyle?

`toThrow` hata üreten çağrıyı callback içinde çalıştırır; böylece Vitest hatayı yakalayıp türünü ve mesajını karşılaştırabilir. Geçerli ve geçersiz girdiler ayrı davranış adları taşır. Ondalık ve `NaN` değerleri de sınamak, yalnızca alt ve üst sayısal sınırları kontrol etmekten daha kapsamlıdır.
