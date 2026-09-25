## Neden böyle?
`useActionState` Action'a önceki state ve `FormData` verir; `[state, formAction, isPending]` döndürür. `<form action={formAction}>` React'in pending akışını bağlar. Gerçek API hatasında Action uygun hata state'i döndürmeli; form validasyonu için Modül 14–15'teki RHF/Zod bilgini koru.
