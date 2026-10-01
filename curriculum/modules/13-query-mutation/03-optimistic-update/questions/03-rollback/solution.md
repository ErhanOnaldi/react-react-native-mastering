## Neden böyle?

`rate` yalnızca sunucu yazmasını yapar; hook cache’in geçici görünümünü yönetir. `onMutate` önce eski listeyi snapshot olarak saklar, sonra immutable biçimde değiştirir. Hata gelirse `onError` önceki listeyi koyar, `onSettled` de aynı session’ın verisini sunucudan yeniden aldırır. Bu görev tek bekleyen puanlama varsayar; eşzamanlı güncellemelerde eski snapshot başka bir güncellemeyi ezebilir.
