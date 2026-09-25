# Sinema v1 — acı günlüğü

Gerçek TMDB verisini bağladıktan sonra tarayıcının Network sekmesinde gördüklerim:

1. `/` açılınca trend listesi ve tür listesi için iki GET gidiyor. Aksiyon seçince `/discover/movie?with_genres=28` ayrıca gidiyor; türü değiştirirken önceki cevap da yarışabilir. `useEffect` içinde `ignore` ile eski cevabın ekrana yazılmasını önledim; istek yine atılmış oluyor.
2. `/search?q=Matrix` adresine ilk girişte bir arama isteği gidiyor. Detaya gidip tarayıcıda geri dönünce SearchPage yeniden mount ediliyor ve aynı arama tekrar gidiyor. Dev ortamında StrictMode yüzünden sayı daha yüksek görünebilir. Bellekte paylaşılan bir cache yok.
3. HomePage, SearchPage, MovieDetailsPage ve FavoritesPage ayrı ayrı `loading`, `error` ve veri state'i tutuyor. Dört yerde benzer `setLoading(true)` / `catch` / `finally` var. Her yeni endpoint için aynı akışı yazmak yorucu.
4. `/movie/550` sayfasından uygulama içi navigasyonla `/movie/27205` adresine gidince URL değişiyor ama eski "Dövüş Kulübü" ekranda kalabiliyor. Details effect'inin dependency array'inde `movieId` eksik; bunu Modül 8'de lint ile yakalayıp düzelteceğim.
5. Favorilerde üç id varsa üç ayrı detay isteği gidiyor. Aynı filme başka sayfada bakınca veri tekrar çekiliyor. Geri dönüşte anlık loading ekranı da gözle görülüyor.

Bir sonraki adımda önce lint ile gizli dependency hatasını, sonra yapı ve veri aracıyla tekrar eden kodu ve gereksiz istekleri ele almak istiyorum. İstek sayısını doğrularken production ile geliştirme StrictMode sonuçlarını karıştırmamalıyım.
