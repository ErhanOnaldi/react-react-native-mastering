## Neden böyle?

RHF formun geçerliliği ve değerleriyle ilgilenir. `useMutation` yazma isteğinin pending/success/error durumunu tutar. Fetch 400'de otomatik hata fırlatmadığı için `response.ok` gerekir. `mutateAsync` beklenirse reset yalnızca başarıdan sonra çalışır. İleride Zod, form kuralları ile TypeScript tipini tek şemadan çıkaracak.
