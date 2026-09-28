---
title: "Sinema’da kalıcı ve korumalı oturum"
minutes: 6
kind: project
---

# Sinema’da kalıcı ve korumalı oturum

:::pain[Sinema'da oturum ve güvenlik açıkları]
Şimdiye kadar öğrendiğin tüm kimlik doğrulama ve güvenlik taşlarını Sinema projesinde birleştirme zamanı. Projede üç temel sorun seni bekliyor:
1. Giriş yapılsa bile sayfa yenilendiğinde oturumun sıfırlanması.
2. `/watchlists` ve `/profile` sayfalarının korumasız olması ve doğrudan URL yazılarak açılabilmesi.
3. Access token süresi dolduğunda eşzamanlı isteklerin 401 alıp yarışarak oturumu bozması ve çıkış sonrasında eski verinin bellekte kalması.
:::

## Proje görevlerinin mimari bağlamı

Bu proje çalışmasında, egzersizlerde parça parça inşa ettiğin çözümleri Sinema uygulamasının gerçek kod tabanına entegre edeceksin. Dört aşamalı bir geliştirme sırası izleyeceksin:

### 1. Giriş ve Auth State (`01-giris-ve-auth-state`)
`src/features/auth/` altında API ve durum yönetimini kuracaksın. DummyJSON üzerinden kullanıcı adı ve parola ile oturum açılacak; dönen token çifti ve kullanıcı bilgisi hem Redux `authSlice` durumuna hem de sayfa yenilemelerinde kalıcılık sağlamak üzere `sinema-auth` depolama kaydına işlenecektir. `LoginPage` formu ve `ProfilePage` bileşeni bu durumla bağlanacaktır.

### 2. Dayanıklı Auth İstemcisi (`02-auth-client`)
Korumalı uç noktalara yapılacak istekleri yönetecek merkezi `authClient` modülünü tamamlayacaksın. Bu istemci, her isteğe güncel `Authorization: Bearer <accessToken>` başlığını ekleyecek; 401 durumunda tek uçuşta (`inFlight`) yeni token çifti alıp istekleri bir kez tekrarlayacaktır.

### 3. Korumalı Rotalar ve Temiz Çıkış (`03-korumali-sayfalar-ve-cikis`)
React Router üzerinde `ProtectedRoute` layout kapısını konumlandıracaksın. `/watchlists` ve `/profile` rotaları bu kapının altına taşınırken, `/login` herkese açık kalacaktır. Çıkış butonuna basıldığında ise `logout` yardımcısı hem depolamayı, hem Redux durumunu hem de TanStack Query önbelleğini atomik olarak sıfırlayacaktır.

### 4. Güvenli Dönüş Adresi (`04-guvenli-donus-adresi`)
Giriş sonrasında kullanıcının yönlendirileceği hedef yolu (`location.state.from` veya `?redirect=`) açık yönlendirme (open redirect) saldırılarına karşı denetleyen `getSafeRedirect` fonksiyonunu entegre edeceksin. Yalnızca uygulama içi geçerli mutlak yollar kabul edilecektir.

## Çalışma yöntemi ve sözleşme kuralları

- Sinema projesindeki değişikliklerini doğrudan `projects/sinema` altında geliştireceksin.
- Önceki modüllerden gelen `store`, `RootState`, `AppDispatch` ve hook export'larının bozulmadığından emin ol.
- TMDB API token'ı (`VITE_TMDB_TOKEN`) ile kullanıcı oturum token'larını (`accessToken`) asla birbirine karıştırma.
- Doğrulama için repo kökünden `pnpm validate:content -m 17` komutunu çalıştırabilirsin.
