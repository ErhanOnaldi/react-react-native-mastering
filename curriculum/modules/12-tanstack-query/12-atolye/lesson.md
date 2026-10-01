---
title: "Query modellerini yeni ekranlarda uygula"
minutes: 6
kind: practice
---

# Query modellerini yeni ekranlarda uygula

Bu atölyede aynı Query fikirlerini üç yeni işte kullanacaksın: popüler film listesini kısa süre cache’te tut, tür ve sayfa seçimine göre keşfi güncelle, sonra gönderi ile yazar bilgisini bir içerik panosunda birleştir. Son görev farklı bir API dünyasına geçer; Query’deki veri sahipliği ve yükleme akışı aynı kalır.

:::model[Server state ve Query cache]
Sunucudan gelen cevap server state’tir; kullanıcının seçtiği tür ve sayfa URL state’tir. Query key cevabı değiştiren seçimleri taşır, `staleTime` ise cevabın ne kadar süre taze sayılacağını belirler. Tür değişince sonuç da değişeceği için tür key’in parçası olmalıdır.
:::

İlk iki işi Sinema’daki filmlerle yap. Popüler listeye dönüp cache davranışını gözle; keşifte tür ve sayfayı değiştir, sonra tarayıcı geri tuşuyla önceki seçimin geri geldiğini kontrol et. Son işte gönderi listesi, arama, detay ve yazar verisi arasında bağlantı kur; detaydan dönünce aramanın korunmasına dikkat et.

Önceki derslerden query key’leri, `staleTime`, sayfalama, URL parametreleri ve bağımlı sorgu fikrini hatırla. Her ekranda yükleniyor, hata, boş ve başarılı durumların kullanıcıya ne söylediğini de kontrol et.

## Hatırlayacağın noktalar

- Cache süresi ile verinin kimliği iki ayrı karardır.
- URL’deki tür ve sayfa seçimi doğru query key’e yansımalıdır.
- İlişkili sunucu verilerini ayrı sorgulardan alıp ekranda birlikte gösterebilirsin.

**Terimler:** `query key` bir cevabı tanımlayan cache kimliği; `staleTime` cevabın taze kabul edildiği süre; `URL state` bağlantıda saklanabilen ekran seçimi.

**Kendini yokla:** Tür değişince eski türün cevabını göstermemek için ne değişmeli?

**Yanıt:** Tür hem URL seçimini hem de query key’i değiştirmeli; böylece her tür kendi sonucunu alır.
