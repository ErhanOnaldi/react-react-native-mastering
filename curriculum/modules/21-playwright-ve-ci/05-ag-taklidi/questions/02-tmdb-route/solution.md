## Neden böyle?

`URLSearchParams` kodlanmış Türkçe karakteri çözer. String içinde `query=dövüş` aramak `%C3%B6` nedeniyle çalışmaz. TMDB liste zarfı, uygulamanın `results` okumasını sağlar; yalnızca film dizisi döndürmek sahte API’nin kendisini bozar.

Bearer kontrolü, Modül 11’deki sahte TMDB’nin 401 davranışını korur. Her isteğe koşulsuz başarılı yanıt vermek gerçek token hatasını saklar. Proje görevinde aynı route fikrini arama, detay ve DummyJSON giriş akışına uygulayacaksın.
