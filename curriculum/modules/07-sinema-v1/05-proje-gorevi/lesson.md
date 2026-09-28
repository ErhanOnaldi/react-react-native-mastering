---
title: "Proje görevi: Sinema'yı canlı veriye bağla"
minutes: 6
kind: project
---

# Sinema'yı canlı veriye bağla

:::pain[Problem]
Sinema'nın arayüzü hazır; ancak film kartları hâlâ projeye gömülü statik test verilerini gösteriyor. Yeni çıkan filmleri keşfetmek, yüz binlerce yapım arasında arama yapmak veya seçilen bir türe göre listeyi filtrelemek mümkün değil. Gerçek bir web uygulaması canlı bir REST API ile konuşmalı, ağ gecikmelerini ve sunucu hatalarını zarifçe yönetmelidir.
:::

## Görevlerin bağlamı ve mimari akış

Bu proje çalışmasında Sinema uygulamasını baştan sona harici TMDB (The Movie Database) servisine bağlıyorsun. Geliştirmeyi birbiri üzerine inşa edilen beş mantıksal aşamada yürüteceksin:

1. **Merkezi API Yardımcısı (`tmdb.ts`):** Tüm bileşenlerin kullanacağı tek bir istek kapısı kuracaksın. Taban URL birleştirme, Bearer yetkilendirme başlığı, varsayılan Türkçe dil parametresi ve `response.ok` hata denetimi tek bir fonksiyonda toplanır.
2. **Canlı Trend Vitrini (`HomePage.tsx`):** Ana sayfa açıldığında haftalık popüler filmler harici servisten çekilir; yerel statik dizi tamamen devreden çıkarılır.
3. **URL ile Canlı Arama (`SearchPage.tsx`):** Arama terimi (`q`) doğrudan tarayıcı adresinden okunur. Kullanıcı yazdıkça URL güncellenir; tuş vuruşları geciktirilerek sunucu gereksiz istek yağmurundan korunur.
4. **Film Detayı ve Kadro (`MovieDetailsPage.tsx`, `FavoritesPage.tsx`):** Rota parametresi (`/movie/:id`) doğrulanır, tek bir istekte film bilgileri ve oyuncu kadrosu alınır. Favoriler sayfasındaki filmler gerçek API detaylarıyla beslenir.
5. **Tür Filtresi ve Sayfalama:** Kullanıcı açılır kutudan bir tür seçtiğinde keşif servisi devreye girer. Sayfa numarası URL'de saklanır; tür değiştiğinde sayfa başa sarılır.

## Bu görevlerde ne ölçülüyor?

Bu proje modülünde ölçülen temel mühendislik becerileri şunlardır:

- **Sözleşmeye sadakat:** Harici API sözleşmesinin gerektirdiği başlıkları (`Authorization: Bearer`), sorgu parametrelerini ve hata kodlarını eksiksiz uygulamak.
- **Hata ve durum disiplini:** Ağ isteklerinin doğal parçası olan yükleniyor (`loading`), hata (`error`) ve boş sonuç (`empty`) durumlarını arayüzde doğru erişilebilirlik rolleriyle (`status`, `alert`) kullanıcıya yansıtmak.
- **Parametre ve sınır güvenliği:** Sayısal olması gereken bir rota parametresine (`/movie/abc`) harici servise istek atmadan hemen önce sınır kontrolü uygulamak; eksik verilerde (örneğin afişi olmayan filmlerde) arayüzün çökmesini önlemek.
- **Tek doğru kaynak ilkesi:** Arama ve filtreleme durumlarını bileşen içi geçici state'lerde kaybetmek yerine URL query parametreleriyle senkronize tutmak.

## Nasıl çalışmalısın?

- Çalışırken tarayıcının **DevTools Network** sekmesini sürekli açık tut. Hangi uç noktaya hangi başlıklarla istek gittiğini, durum kodlarını ve dönen JSON yanıtlarını canlı gözlemle.
- Adımları sırayla tamamla: Önce temel API yardımcısını sağlamlaştır; ardından sayfaları tek tek canlı servise geçir.
- Şimdilik sayfalarda tekrar eden `loading` ve `error` durum kodlarını gizlemeye veya erken bir önbellek katmanı kurmaya çalışma; saf yöntemin getirdiği bu maliyeti çıplak gözle izle.

:::sector
Sektörde büyük ölçekli bir uygulamaya yeni bir dış servis entegre edilirken ilk kural "isteği dağıtmamak"tır. Her bileşenin kendi içinde çıplak `fetch` çağrısı yapması, yarın API anahtarı değiştiğinde veya yeni bir yetki başlığı gerektiğinde onlarca dosyanın taranması demektir. Merkezi bir yardımcı ile başlamak bu bağımlılığı tek bir sınırda tutar.
:::
