---
title: "Arama akışını birleştir"
minutes: 6
kind: practice
---

# Arama akışını birleştir

:::pain[Problem]
Hızlı yazma, geciken cevap, boş sorgu ve HTTP hatası aynı arama ekranında birleşiyor. Tek tek çözdüğün mekanizmalar birlikte çalışmazsa kullanıcı bazen eski sonucu, bazen yanlış hata mesajını görür.
:::

Bu pekiştirmede iki farklı yüzey var. İlk görev hook seviyesinde çalışır: `useMovieSearch` yalnızca state döndürür ve testler onu `renderHook` ile izler. İkinci görev bileşen seviyesindedir: kullanıcı `Film ara` input'una yazar, sonuçları ekranda görür, input'u temizleyince liste boşalır.

:::model[Effect yaşam döngüsü]
Bu akışta iki ayrı dış sistem var: timer ve ağ. Timer, kullanıcının ham yazısına bağlıdır; ağ isteği gecikmiş sorguya bağlıdır. İkisini tek effect'e sıkıştırırsan cleanup'ların neyi temizlediği belirsizleşir.
:::

:::model[Race condition]
Yeni sorgu başladığında eski isteğin sonucu artık ekrana yazmamalı. İster bayrakla yok say, ister desteklenen yerde abort et; kullanıcı için kural aynı: son geçerli sorgu kazanır.
:::

## Çalışma sırası

| Aşama | Kontrol edeceğin şey |
| --- | --- |
| Boş query | `idle`, istek yok, eski liste temiz |
| Hızlı yazma | yalnız son query için arama isteği |
| Başarı | `success`, başlık dizisi dolu |
| Hata | `error`, mesaj okunabilir |
| Temizleme | input boşalınca eski başlık ekranda kalmaz |

Yeni üçüncü soru, aynı arama akışının reducer tarafını test ettirir. Burada ağ yok; `movieSearchReducer` saf fonksiyon olarak davranır. Reducer testlerinde bütün state nesnesini karşılaştırmak faydalıdır, çünkü "başarıda eski hata temizlendi mi?" gibi alanlar kolay kaçabilir.

:::mistake[Sık hata]
Belirti → Input silindikten sonra `Matrix` listede kalıyor. Neden → Boş sorgu state'i ayrı ele alınmadı. Düzeltme → Boş query'de idle/temiz listeye dön.
:::

:::sector
Arama kutuları ürünlerde küçük görünür ama en çok hata üreten alanlardandır. Debounce, iptal ve durum geçişleri testle kilitlenince kullanıcı hızına bağlı bug'lar azalır.
:::

## Özet

- Timer ve ağ cleanup'ları ayrı sorumluluklardır.
- Boş sorgu, boş başarıdan farklıdır.
- Reducer geçişleri saf fonksiyon testleriyle net yakalanır.
- Son geçerli sorgunun sonucu ekranda kalmalıdır.

Kendini yokla: Reducer testinde neden `status` yanında `error` ve `results` alanlarını da beklemek gerekir?  
Cevap: Mutantlar çoğu zaman yalnız ana durumu değil, eski veri temizliğini bozar.
