## Neden böyle?

`tmdbFetch<T>` çağıran sayfaya tipli veri sözü verir; JSON'u çalışma zamanında doğrulamaz. Başlık ve dil tek yerde olunca yeni endpoint için bunları tekrar yazmazsın. `fetch` 404'te kendi başına hata fırlatmadığı için `response.ok` kontrolü zorunlu.

`init` parametresi ileride `AbortController.signal` veya başka HTTP seçeneklerini iletir. Gerçek uygulamada tarayıcıya gömülen `VITE_` token gizli kalmaz; üretim için sunucu aracısı gerekir. Bu modülde yerel öğrenme uygulamasını doğrudan TMDB'ye bağlıyoruz.
