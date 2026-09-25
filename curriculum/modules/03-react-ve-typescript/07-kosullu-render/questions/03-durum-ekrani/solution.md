## Neden böyle?

Discriminated union’da `status` kontrolü TypeScript’in `data` ve `message` alanlarını doğru dalda açmasını sağlar. `as` ile zorlamak eksik durumları gizler. Burada sahte statik durum props’u var; gerçek ağ isteği Hook’lar modülünde ele alınacak. Boş başarı, yüklenme ve hata birbirinden farklı kullanıcı durumlarıdır.
