Env değerleri string'dir, eksik olabilir, yanlışlıkla boşluk içerebilir. Uygulamanın her yerinde bunlarla uğraşmamak için tek bir `readConfig` fonksiyonu yazıyoruz.

`readConfig(env)` bir env nesnesi alır (gerçekte `import.meta.env`; testte sahte bir nesne) ve şunu döndürür:

```ts
{ tmdbToken: string; appTitle: string; pageSize: number }
```

Kurallar:

| Alan | Kaynak | Kural |
| --- | --- | --- |
| `tmdbToken` | `VITE_TMDB_TOKEN` | Baştaki/sondaki boşluklar atılır. Eksik ya da boşsa **hata fırlatılır**; mesaj `VITE_TMDB_TOKEN` içermeli. |
| `appTitle` | `VITE_APP_TITLE` | Boşluklar atılır; eksik ya da boşsa `"Sinema"`. |
| `pageSize` | `VITE_PAGE_SIZE` | Sayıya çevrilir; pozitif tam sayı değilse `20`. |

Neden hata fırlatıyoruz? Token yoksa uygulama zaten çalışamaz; bunu ilk saniyede açık bir mesajla söylemek, yarım saat sonra anlamsız bir 401 hatasıyla boğuşmaktan iyidir (**fail fast**).
