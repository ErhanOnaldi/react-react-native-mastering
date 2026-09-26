## Neden böyle?

`details` sorgusunun kimliği (`queryKey`) hiç değişmiyordu; içindeki `queryFn` her defasında güncel `authorKey`'i kullanıyor olsa da, TanStack Query yalnızca **kimlik** değiştiğinde yeniden çalışır. Aynı kimlikle çağrılan bir sorgu, önbellekte ne varsa onu gösterir — kapanan closure'ın güncel değişkeni önemli değildir. Eser değişince yazar sorgusunun da yeniden çalışması gerektiğinden, kimliğe `workId`'yi (ya da doğrudan `authorKey`'i) eklemek zorunludur.

Bu, 13. modülde gördüğün "tür değişince liste aynı kalıyor" hatasının bir adım ilerisi: orada tek bir sorgunun kimliği eksikti, burada **bağımlı** (dependent) bir sorgunun kimliği eksik. `enabled` doğru kurulmuş olsa bile (yalnızca `work.data` hazır olduğunda çalışıyor), kimlik yanlışsa `enabled` tek başına seni kurtarmaz.

**Alternatif:** İki ayrı sorgu yerine tek bir `queryFn` içinde hem eseri hem yazarı sırayla isteyip `queryKey: ['book', workId]` ile tek sorguya toplayabilirdin. Bu, "iki sorgunun kimliğini senkronize tutma" derdini tamamen ortadan kaldırır ama eseri ve yazarı ayrı ayrı önbelleğe alamazsın (örn. aynı yazarın başka bir eserine bakarken yazar tekrar istenir).

**Tuzaklar:**
- Yalnızca `authorKey`'i kimliğe koymak da çalışır ama `authorKey` bazen `undefined` olabiliyorsa (eser henüz gelmediyse) `workId` daha güvenilir bir ayraçtır.
- `enabled` koşulunu kaldırıp sorguyu hep açık bırakırsan, `work.data` henüz yokken `authorKey` de `undefined` olur ve gereksiz bir istek atılır.

Bir sonraki (mimari) görevde artık bu ilişkili eser/yazar sınırını sıfırdan, testsiz bir projede kendin kuracaksın.
