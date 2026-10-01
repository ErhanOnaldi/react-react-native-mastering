## Neden böyle?

**Hatanın gerçek yeri.** Başlangıçtaki hata `cardLines` satırında çıkıyordu, ama yanlış olan o satır değildi. Kart tipi `poster_path: string` diye elle yazılmıştı; `Movie`'de ise alan `string | null`. Hatayı `movie.poster_path ?? ''` ile susturmak derlemeyi geçirirdi, ama posteri olmayan film kartta sessizce boş bir yol taşırdı. Doğru düzeltme, kart tipini kaynağa bağlamak.

**Neden `Pick`?** `Pick<Movie, 'id' | 'title' | 'poster_path' | 'vote_average'>` alanların tiplerini `Movie`'den alır. `Movie`'de bir alanın tipi değişirse kart tipi de kendiliğinden değişir. İleride `Movie`'ye yeni alanlar eklendiğinde ise kartın tipine girmezler, çünkü kart yalnızca adı verilen alanları gösterir.

**Neden küçük tip?** `cardLine`'ı dört alanlık bir nesneyle çağırabilmek, onu denemeyi kolaylaştırır. Aynı fonksiyonu elinde tam `Movie` olmayan yerlerde de kullanabilirsin. Tam bir `Movie` de kabul edilir: istenen dört alan onda da var.

**Daraltma.** `poster_path === null` kontrolü, önceki modüldeki narrowing'in aynısı. `else` dalında TypeScript alanın `string` olduğunu bilir.

**Sonraki adım.** React modülünde `MovieCard` bileşeninin props'larını da aynı şekilde `Movie`'den türeteceksin.
