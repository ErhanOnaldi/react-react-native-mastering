---
title: "Query modellerini yeni ekranlarda uygula"
minutes: 6
kind: practice
---

# Query modellerini yeni ekranlarda uygula

:::pain[Problem]
Popüler listeden başka ekrana gidip dönünce başlıklar yeniden yükleniyor. Keşifte türü değiştirince URL yeni seçimi gösterse de önceki sonuç kalıyor. İki belirtinin ortak noktası, verinin kimliği ve yaşamının ekrandaki seçimlerle tutarlı olmaması.
:::

## Her akış için önce sahibi bul

:::model[Server state ve Query cache]
Sunucunun cevabı server state’tir; filtre URL’den geliyorsa URL state’tir. Key, cevabı belirleyen seçimleri taşır; tazelik süresi geri dönüşte tekrar isteyip istememeyi etkiler. Yeni ekranda hangi verinin paylaşıldığını ve hangi seçimin değişince yeni cevap gerektiğini belirle.
:::

Popüler liste, tür seçimiyle değişen keşif ve gönderi/yazar ilişkisi birbirinden farklı bağlamlar. Önce her endpoint’in parametresini, cevap biçimini ve hata ihtimalini oku. Sonra yükleme, hata, boş ve başarı görünümünü ayrı düşün. Detaydan listeye dönüşte kullanıcının arama ifadesi URL’de ya da ekran state’inde korunmalı; API cevabını da yeniden gereksiz yere kopyalama.

Görevleri sırayla çöz. İlkinde bir listenin kısa süreli cache davranışı, ikincisinde URL’den gelen iki filtrenin birlikte çalışması, üçüncüsünde farklı kaynaklardan gelen kayıtların ilişkisi üzerinde dur. Her adımda Network’te hangi isteğin hangi seçim için gittiğine bak.

:::sector
Atölye projelerinde kodu yalnızca görev bitti diye bırakma. Gerçek cevapla birkaç kayıt ve sınır durumunu gözden geçir; ekranı açıp kapat, geri dön ve seçimleri değiştir. Bir component’in hangi veriyi sahibi olduğuna dair kararını ekip arkadaşına açıklayabilmelisin.
:::

## Özet

- Her veri kaynağının sahibini belirle.
- URL seçimiyle cache kimliğini tutarlı kıl.
- Yükleme, hata, boş ve başarı durumlarını kullanıcıya açık göster.

**Kendini yokla:** Tür değişince eski cache cevabının görünmemesi için hangi ilişki doğru kurulmalı?

**Yanıt:** Tür hem URL’den okunmalı hem sonucu tanımlayan query key’in parçası olmalı.
