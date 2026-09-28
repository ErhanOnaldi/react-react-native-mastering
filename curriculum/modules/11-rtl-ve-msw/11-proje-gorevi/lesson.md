---
title: "Sinema için test sınırını kur"
minutes: 6
kind: project
---

# Sinema için test sınırını kur

:::pain[Problem]
Sinema’da tarih biçimlendiren yardımcılar testli; ancak arama sayfasında kullanıcı ne görür, detay linki doğru filmi açar mı, sunucu hata verince ne olur bilinmiyor. Her testte farklı ağ taklidi yazmak, cevap biçimlerini ve kurulum ayrıntılarını birbirinden koparıyor.
:::

:::model[MSW perdesi]
Uygulamanın isteği kendi fetch koduyla çıkar; MSW HTTP sınırında yakalar; handler gerçek API biçimine uygun yanıt verir; component bu yanıtı görünür duruma çevirir. Proje altyapısında amaç bu yolu yeniden kullanılabilir hale getirmek ve her testin yalnız senaryoya ait farkı belirtmesini sağlamaktır.
:::

## Altyapı ve davranış aynı yerde buluşsun

Önce ortak test ortamının sorumluluklarını ayır: test lifecycle’ı, başlangıç handler’ları ve router’lı render yardımı. Her biri belirli bir tekrarı kaldırmalı. Lifecycle istek yakalamayı başlatıp testler arasında temizler; handler’lar geçerli API cevabını tanımlar; render helper başlangıç URL’i ve gerekli provider’ı sağlar.

Sonra arama ve detay ekranlarını kullanıcıya görünen sözleşmeleriyle ele al. Arama alanı rol/ad ile bulunabilmeli, klavye ve düğme etkileşimleri doğal çalışmalı; başarılı, boş ve hata cevapları farklı görünür durumlara dönüşmelidir. Detay sayfası URL kimliğini okur ve bulunmayan kaydı anlaşılır şekilde ele alır. Her senaryoda gerçek API’ye bağlanmadan kontrollü handler cevabı kullan.

Çalışırken önce dosya yolları ve export sözleşmelerini oku, sonra bir mutlu yol üzerinden altyapıyı doğrula. Ardından boş response, HTTP hata ve route parametresi gibi sınırları ekle. Bir helper’a tüm uygulamanın state’ini doldurma; yeni bir provider ya da API davranışı eklediğinde tek sorumluluğu koru.

:::sector
Gerçek projelerde test altyapısı ekip için ortak bir yüzey oluşturur: her dosya ayrı MSW kurulumunu, auth header’ını ve router wrapper’ını yeniden yazmaz. Ortak başlangıç gerçekçi kalır; her test yalnızca farklı olan cevabı tarif eder.
:::

## Özet

- Test lifecycle’ı, handler’ları ve render ortamını ayrı sorumluluklarda kur.
- Başarı, boş sonuç ve HTTP hatasını kullanıcı davranışı olarak ele al.
- Router başlangıç URL’ini testte açıkça seç.
- Test ortamı gerçek ağa çıkmamalı; bilinmeyen istek görünür hata olmalı.
