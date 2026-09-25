## Neden böyle?

`[id]` effect’in okuduğu reaktif değeri açıkça listeler. `[]` yalnızca ilk bağlanmada çalıştırır. Kuralı devre dışı bırakmak sessiz stale ekran üretir. Gerçek TMDB isteğinde ayrıca `AbortController` cleanup gerekir; bu, Modül 5’teki yarış koşulu bilgisini yeni route bağlamında kullanır.
