## Neden böyle?

Favori state’i yalnız bu ekranın etkileşiminde kullanılıyor; paylaşılması gereken ortak bir uygulama state’i yok. Bu görevde Redux kurmak gereksiz, bileşen state’i yeterli.

Üç farklı state kategorisi burada bir arada: tür/sayfa **URL state**'idir (paylaşılabilir, geri/ileri ile gezinilebilir), film listesi **server state**'idir (TMDB'den gelir, tür/sayfa değişince yeniden istenir), favoriler ise **client state**'idir ve film kimliğine bağlıdır — hangi tür veya sayfada görüldüğüne değil. Favorileri `Set<number>` gibi id tabanlı bir yapıda tutmak, listenin içeriği değişse bile doğru filmi doğru işaretle eşler.

Favoriler uygulamanın başka ekranlarında da gösterilseydi ortak store anlamlı olabilirdi. Sık hata: favori bilgisini o anki film listesiyle aynı state nesnesinde tutmak — bu, liste yeniden çekildiğinde favori işaretini de sıfırlar. Sonraki görevde bu ekranın bir başka sürümünde tam olarak bu karışıklığı teşhis edeceksin.
