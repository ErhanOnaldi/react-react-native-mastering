---
title: "Sinema modalı ve detay sekmeleri"
minutes: 7
kind: project
---

# Sinema modalı ve detay sekmeleri

:::pain[Belirti]
Sinema'nın detay sayfası uzun: özet, oyuncular, videolar, izleme listesi ve yorum alanları art arda duruyor. Fragman için başka siteye gitmek gerekiyor. Yalnız klavyeyle sayfayı dolaştığında hangi bölümde olduğunu ve açılır pencereyi nasıl kapatacağını kestiremiyorsun.
:::

Bu proje, erişilebilir arayüz sözleşmelerini gerçek bir sayfa akışında bir araya getiriyor. Tekrar kullanılabilir bir modal ailesi açılış, klavye dolaşımı ve kapanış focus'unu yönetirken; detay sayfasındaki sekmeler içerik bölümlerini düzenliyor. Fragman verisi filmden geldiği için düğme yalnızca gerçekten açılabilecek bir video olduğunda görünmeli. Film kartındaki ve detay sayfasındaki favori kontrolleri de tutarlı ad ve durum anlatmalı.

## Uygularken

Önce küçük parçaları tek tek düşün: modalın kapalı/açık durumu, tetikleyici, içerik ve kapatma kontrolü; ardından sekmelerin tek seçimi, trigger-panel ilişkisi ve klavye sırası. Parçaların birlikte kullanıldığı anda Context sınırının nerede başladığını, yanlışlıkla kök dışında kalan bir parçanın nasıl anlaşılır davranacağını kararlaştır.

Sonra MovieDetails sayfasındaki veri akışını takip et. Başlık ve fragman aynı filmden gelmeli; oyuncu listesi ve video listesi mevcut veriye dayanmalı. Video yoksa hem gereksiz sekme hem tetikleyici üretme. Var olan sayfa düzenini ve puanlama, izleme listesi, yorum gibi bölümleri koruyarak yeni alanları ekle.

Focus akışını tarayıcıda kendi elinle dolaş: Tab ile fragman düğmesine gel, Enter ile aç, dialog içinde iki yönde gezin, Escape ile kapat. Ardından sekmelere Tab ile girip ok tuşlarını dene. Ekran okuyucu adı, panel ilişkisi ve focus halkası birlikte anlaşılır olmalı. 550 filmi ve videosu olmayan bir filmi kontrol etmek gerçek veri sınırlarını görünür kılar.

:::tip[İnceleme sırası]
Bir davranışı izole kontrol et, sonra gerçek film sayfasında tekrar et. Son olarak klavye ile baştan sona dolaş; focus'un görünür ve beklenen yerde olduğunu doğrula.
:::

:::sector
Ürün ekipleri modal ve tabs gibi temel bileşenleri tasarım sisteminde ortaklaştırır; uygulama sayfası ise gerçek veri, boş durum ve bölüm kompozisyonundan sorumludur. Bu sınırı korumak aynı klavye davranışını farklı sayfalara taşımayı ve hata düzeltmesini kolaylaştırır.
:::

## Özet

- Modal davranışı ortak bir API'de; gerçek içerik sayfada kalır.
- Focus açılışta dialoga, kapanışta tetikleyiciye döner.
- Sekme içeriği erişilebilir isim ve id ilişkisiyle seçime bağlanır.
- Film verisi eksik olduğunda kullanılmayan etkileşim görünmez.
- Son kontrolü yalnız fareyle değil, klavye akışıyla yap.
