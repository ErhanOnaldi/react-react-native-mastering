## Neden böyle?

URL'den gelen değer kullanıcı girdisidir. Önce rakam biçimini, sonra `Number.isSafeInteger` ve pozitifliği denetlemek `NaN`, `0` ve dev sayıları engeller. `as number` çalışma zamanında dönüştürmez. Sonraki görevde bu yardımcıyı `useParams` ile birleştireceksin.

:::sector
Sektörde URL parametreleri güvenilmeyen girdi kabul edilir; API çağrısından önce doğrulanır.
:::
