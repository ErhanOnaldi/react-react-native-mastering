## Neden böyle?

Zod, boş alanı ağ isteğinden önce yakalar; sunucu ise parolanın doğruluğuna karar verir. RHF alan durumunu yönetir, `zodResolver` aynı kuralı ikinci kez `register` içinde yazma ihtiyacını kaldırır. `setError('root')` sunucu hatasının tek bir alana ait olmadığını anlatır.

Bir alternatif, tüm formu controlled state ile yazmaktır; önceki modülde bunun render ve tekrar maliyetini gördün. Sonraki ders token’ın yenileme sonrası nerede yaşayacağını sorgulayacak.
