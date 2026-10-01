## Neden böyle?

`useMutation` hook’u çağrıldığında yalnız işlemi ve durumunu hazırlar. `mutate` (veya `mutateAsync`) çağrısı kullanıcı eyleminden sonra `rate` fonksiyonunu çalıştırır; böylece render sırasında sunucuya yazılmaz.
