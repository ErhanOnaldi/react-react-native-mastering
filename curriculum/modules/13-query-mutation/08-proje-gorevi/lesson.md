---
title: "Sinema: puanlama akışını tamamla"
minutes: 7
kind: project
---

# Sinema: puanlama akışını tamamla

:::pain[Problem]
Sinema’nın film sayfaları Query cache’inden hızlı açılıyor. Fakat puanlama sunucuya kalıcı gitmiyor; başarılı kayıt sonrası “Puanladıklarım” eski kalıyor. Kullanıcı 500 cevabı aldığında ekranda onaylanmış gibi duran değer de kaybolmuyor.
:::

## Üç teslimde bir bütün oluştur

Bu proje, modülde ayrı ayrı ele aldığın yazma ve okuma sınırlarını Sinema’da bir araya getirir. İlk teslim session’a bağlı puanlama API’si ve rated liste query’sidir. İkincisi optimistic görünüm, hata halinde rollback ve `/rated` sayfasıdır. Üçüncüsü detay route’unda veriyi geçiş sırasında hazırlayıp aynı Query cache’ine bağlamaktır.

Çalışma sırası:

1. Guest session kimliğinin tekrar kullanılmasını ve puan yazma/silme cevaplarında HTTP hatalarının ele alınmasını sağla.
2. Rated listeyi query olarak tanımla; aynı session id bu listenin cache kimliğine de dahil olsun.
3. Puan seçimini erişilebilir kontrolle sun; pending ve başarısız durumu kullanıcıya açık olsun.
4. İyimser değerle ortak listeyi güncelle; başarısız yazmada snapshot’ı geri yükle ve sonunda gerçek listeyi doğrula.
5. Detay navigasyonunda URL parametresini doğrula; loader ile component aynı query tarifine bağlansın.

:::model[Mutation ve invalidation]
Başarılı POST sunucuya yazar ama eski rated query’yi kendi başına yenilemez. Optimistic adım cache’e geçici sonucu koyar; hata rollback yapar, işlem sonunda invalidation sunucu cevabıyla uzlaştırır. Sinema’da rating listesi session’a bağlıdır; başka bir session’ın cache’ini aynı işlemle değiştirme.
:::

:::model[URL state ve route verisi]
Film kimliği URL parametresinden gelir; loader bu kimliği doğrular ve aynı Query tarifini cache’e hazırlar. Detay bileşeni aynı key’e abone kalır. Böylece URL gezinmenin kaynağı, Query cache’i ise sunucu verisinin kaynağı olur.
:::

## Akışı gerçek isteklerle izle

Bir film puanlandığında session yoksa önce session isteği, ardından POST, sonra rated liste GET’i beklenir. Aynı session yeniden kullanıldığında yeni session isteği çıkmamalıdır. Başarısız POST senaryosunda geçici puan görünür, sonra önceki değer geri gelir; başarılı senaryoda liste son kabul edilen değeri gösterir.

Detay route’unda geçersiz id için GET başlatma. Geçerli id’de loader cache’i hazırlar; component’in aynı key’i kullanması gereksiz ikinci isteği önler. Suspense bekleme durumunu, Error Boundary route içindeki render hatasını sahiplenir. Bu sınırların kullanıcıya ne zaman gösterileceğini karar vererek yerleştir.

:::sector
Gerçek uygulamada optimistic görünüm, API’nin gerçekten kaydettiği veriyle kısa sürede uzlaşmalıdır. Ekipler session kapsamını, aynı anda gelen puan yazmalarını ve hata mesajlarının sahipliğini gözden geçirir; yalnızca mutlu yolu değil başarısız POST’u da ürün davranışının parçası sayar.
:::

## Özet

- Session kimliği puan API’si ve rated query key’inde tutarlı olmalı.
- Optimistic cache güncellemesi hata halinde geri alınmalı.
- Başarılı yazma sonrası liste gerçek sunucu cevabıyla uzlaşmalı.
- Loader URL id’sini doğrulayıp component’in kullandığı query cache’ini hazırlar.

**Kendini yokla:** Geçersiz film id’sinde neden loader query başlatmamalı?  
Cevap: `NaN` gibi hatalı kimlik cache’e ve API’ye sızmamalı; kullanıcı route hatasını görmeli.
