---
title: "Sinema’da kalıcı ve korumalı oturum"
minutes: 6
kind: project
---

# Sinema’da kalıcı ve korumalı oturum

Bu projede giriş, sayfa yenileme, korumalı sayfalar ve çıkış akışlarını Sinema’da birleştireceksin. Her aşamada egzersizlerde kurduğun fikri gerçek uygulamanın dosyalarına taşı; önceki aşamanın kullanıcı ve token verisinin sonraki adımlara ulaştığını kontrol et.

:::model[Token yenileme]
Bir korumalı istek `401` (kimlik bilgisi kabul edilmedi yanıtı) alınca access token geçersiz olabilir. İstekler tek bir refresh işlemini paylaşır; yeni token çifti gelince bekleyen istekler bir kez yeniden denenir. Projede aynı akışı merkezi `authClient` üzerinden kullanacaksın.
:::

## Dört adımda ilerle

Önce giriş akışını kur: `https://dummyjson.com/auth/login` adresine kullanıcı adı ve parolayla istek gönder, dönen kullanıcıyı ve token çiftini Redux state’ine yaz, `sinema-auth` kaydında kalıcı tut. Redux state’i uygulama açıkken arayüzün kullandığı oturum bilgisidir; kalıcı kayıt ise sayfa yenilendiğinde bu bilgiyi geri almanı sağlar. Profil sayfasında giriş yapan kişinin kullanıcı adını göster.

Sonra korumalı isteklerin yolunu tek yerde topla. `authClient`, API isteklerini gönderen ortak istemcidir; her isteğe güncel access token’ı ekler ve `401` sonrası yenilemeyi yönetir. `get('/auth/me')` gibi göreli yollar `https://dummyjson.com` tabanına gider. Aynı anda profil ve izleme listesi yüklenirken her isteğin kendi başına refresh başlatmadığını düşün: hepsi tek yenilemeyi beklemeli.

Üçüncü adımda `/watchlists` ve `/profile` rotalarını korumalı layout altında birleştir; `/login` herkese açık kalsın. Oturumsuz kullanıcıyı girişe gönderirken gitmek istediği iç yolu sakla. Dönüş adresi kullanıcıyı uygulama dışındaki bir siteye kaçırırsa buna açık yönlendirme denir; girişten sonra hedefi kullanmadan uygulama içi güvenli bir yol olduğunu doğrula.

Son olarak çıkışta üç yeri temizle: `sinema-auth` kaydı, Redux’taki kullanıcı ve token’lar, ayrıca TanStack Query cache’indeki kullanıcıya ait veriler. Cache, daha önce alınan sunucu verisinin bellekteki kopyasıdır; temizlenmezse çıkıştan sonra eski profil veya liste ekranda kalabilir.

:::model[URL state ve route verisi]
Adres çubuğu kullanıcının bulunduğu sayfayı belirler. Koruma girişe yönlendirse bile hedef yolu saklarsan, başarılı girişten sonra kullanıcı kaldığı sayfaya dönebilir. Dönüş adresini mutlaka uygulama içi güvenli bir yol olarak doğrula.
:::

## Çalışma sırası

Değişiklikleri `projects/sinema` içinde yap. Bir aşamayı bitirince ilgili ekranda görünen kullanıcıyı ve yaptığı ağ isteğini birlikte kontrol et. Giriş ve kalıcılık tamamlanmadan korumalı istekleri bağlama; istekler çalışmadan önce route ve logout davranışını doğrulamaya çalışma. Böyle ilerlemek, sorun çıktığında hangi parçanın oturum bilgisini kaybettiğini bulmanı kolaylaştırır.

TMDB için kullanılan `VITE_TMDB_TOKEN`, kullanıcının access token’ından farklıdır. İkisini aynı depoda ya da aynı başlıkta kullandığını fark edersen, önce hangi API isteğinin hangi kimliği istediğini kontrol et.

## Özet

- Girişte kullanıcıyı ve token çiftini Redux state’ine yaz; sayfa yenilemesi için kalıcı kaydı da güncelle.
- Korumalı istekleri aynı `authClient` üzerinden gönder; `401` yenilemesini ortak akışta tut.
- Özel sayfaları koru, dönüş yolunu doğrula ve çıkışta oturumla ilişkili belleği temizle.
- Adımları sırayla bağla ve her birinde ekranla ağ isteğini birlikte izle.

**Terimler**

- **Access token:** Korumalı API isteğinde kimliği kanıtlamak için gönderilen kısa ömürlü belirteç.
- **Refresh token:** Access token yenilemek için sunucuya gönderilen belirteç.
- **Cache:** Daha önce alınmış verinin bellekte tutulan kopyası.

**Kendini yokla:** Çıkışta Redux state’ini sıfırlamak yeterli mi?

Cevap: Hayır. Kalıcı oturum kaydı ve kullanıcıya ait Query cache’i de temizlenmeli.

**Kendini yokla:** İki korumalı istek aynı anda `401` alırsa neyi ortak kullanmalılar?

Cevap: Tek bir refresh işlemini; sonra ikisi de yeni token’la birer kez yeniden denenir.
