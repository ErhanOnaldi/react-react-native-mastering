## Neden böyle?

`variables` yalnız yerel bekleme göstergesi için en az kodlu yoldur. Hata olursa cache rollback’i gerekmez çünkü cache değişmedi. Başka bir bileşende aynı pending değeri göstermek için `useMutationState` ve ortak `mutationKey` kullanabilirsin. Sonraki görev paylaşılan listeyi de değiştirir.
