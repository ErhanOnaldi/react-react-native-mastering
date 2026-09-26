0. modüldeki `readConfig`'e geri dön. `readConfig(env: Record<string, string | undefined>)` export et ve `{ tmdbToken, appTitle, pageSize }` döndür.

- Token trim sonrası boş olamaz; hata `VITE_TMDB_TOKEN` adını içersin.
- Başlık eksik/boşsa `Sinema`; doluysa trimle.
- Sayfa boyutu pozitif tam sayıysa onu kullan; eksik/geçersizse `20`.
- Girdi Zod ile doğrulansın; dönüş nesnesi uygulamanın kullandığı alan adlarını taşısın.
