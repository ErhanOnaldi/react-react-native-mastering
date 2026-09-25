## Neden böyle?

`register` native input'un ref ve event'lerini RHF'ye verir. `handleSubmit` veriyi derleyip callback'e iletir. `Omit`, sunucunun oluşturduğu `id` ve `createdAt` alanlarını formdan uzak tutar. Elle `new FormData` da kullanılabilir ama alan durumu ve ilerideki kuralları ayrıca yönetmen gerekir. Sonraki görevde checkbox ve başlangıç değeri ekleyeceğiz.
