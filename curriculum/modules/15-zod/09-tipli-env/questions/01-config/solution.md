## Neden böyle?

0. modülde yazdığın if zinciri küçükken yeterliydi. Env arttığında şema kuralları ve çıktı tipini aynı yerde tutar. Env doğrulaması eksik ayarda uygulama açılmadan hata verir; istemciye gömülen `VITE_` değerleri gizli sayılmaz.

## Alternatif, tuzak ve devamı

`.default("Sinema")` boş veya boşluk başlığı düzeltmez; trim sonrası ayrıca ele al. Tüm env’i `z.coerce.number()` ile doğrudan parse edersen geçersiz boyutta eski 20 sözleşmesi kaybolur. Gerçek Sinema’da parse uygulama açılırken yapılacak.
