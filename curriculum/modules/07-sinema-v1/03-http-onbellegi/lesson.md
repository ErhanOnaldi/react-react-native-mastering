---
title: "HTTP önbelleği ve doğrulama"
minutes: 17
kind: concept
---

# HTTP önbelleği ve doğrulama

Sinema'da aynı film türleri listesini kısa aralıklarla yeniden istediğinde tarayıcı bu cevabın bir kopyasını kullanabilir. Bu kopyaya **cache** (önbellek) denir. Burada HTTP önbelleğinden, yani tarayıcının sunucudan gelen cevabı saklayıp ne zaman yeniden kullanacağını belirleyen mekanizmadan söz ediyoruz; JavaScript belleğindeki uygulama verisi ayrı bir katmandır.

İlk örnekte sunucu cevabın kısa süre kullanılabileceğini bildiriyor:

```http
HTTP/1.1 200 OK
Cache-Control: max-age=60
Content-Type: application/json

[{ "id": 28, "name": "Aksiyon" }]
```

`Cache-Control`, cevabın nasıl saklanıp kullanılacağını anlatan HTTP başlığıdır. `max-age=60`, cevabın 60 saniye boyunca **fresh** (taze) sayılacağını söyler. Tarayıcı bu sürede aynı cevaba ihtiyaç duyarsa ağı beklemeden sakladığı kopyayı sunabilir. Böylece hem bekleme hem veri aktarımı azalır.

## Süre bitince kopya hemen çöpe gitmez

Bir dakika geçince kopya artık taze değildir. Fakat bu, içeriğin değiştiğini kanıtlamaz; yalnızca tarayıcının sunucuya güncellik sorması gerektiğini söyler. Sunucu içerik aynıysa tüm JSON'u yeniden göndermeden bunu doğrulayabilir.

İkinci örnekte sunucu, cevaba bir **ETag** (entity tag, içerik etiketi) eklemiştir. ETag, içeriğin belirli bir sürümünü tanımaya yarar; burada `"genres-v1"` kullanıyoruz.

```http
HTTP/1.1 200 OK
Cache-Control: no-cache
ETag: "genres-v1"

[{ "id": 28, "name": "Aksiyon" }]
```

`no-cache`, adı yanıltıcı olsa da “saklama” demez. “Saklayabilirsin, ama kullanmadan önce sunucuya doğrulat” der. Tarayıcı sakladığı etiketi geri yollar:

```http
GET /api/genres
If-None-Match: "genres-v1"
```

`If-None-Match`, sunucuya “bu etiketle sakladığım içerik hâlâ aynı mı?” diye soran request başlığıdır. Sunucu içerik değişmediyse `304 Not Modified` (değişmedi) döner. Bu cevap yeni JSON gövdesi taşımaz; tarayıcı önceki cevabın saklı gövdesini kullanır.

## Doğrulama sırasını izleyelim

| Sıra | Tarayıcı veya sunucu ne yapar? | Uygulamanın aldığı veri |
| --- | --- | --- |
| 1 | Sunucu `200`, JSON ve `ETag: "genres-v1"` yollar | Tarayıcı gövdeyi ve etiketi saklar |
| 2 | Tarayıcı `If-None-Match: "genres-v1"` ile sorar | Henüz yeni gövde yok |
| 3 | Sunucu içerik aynıysa `304` döner | Cevapta yeni gövde yok |
| 4 | Tarayıcı önceki gövdeyi kullanır | Uygulama film türleri listesini alır |

![HTTP önbellek karar ve doğrulama akışı](diagram:http-onbellek-karari)

Sıra önemlidir: `304` kendi başına boş bir film listesi değildir ve yeni veri de sağlamaz. Eski gövdeyle birlikte anlamlıdır. İçerik değişmişse sunucu bunun yerine yeni gövdeyle `200 OK` döner ve tarayıcı saklanan kopyayı yeniler. Böylece değişmeyen cevap tekrar indirilmez.

## Üçüncü örnek: Kopya doğrudan kullanılabilir mi?

Bir yardımcı fonksiyonda tarayıcı kopyasını doğrudan kullanıp kullanamayacağını düşün. Saklanan cevabın yaşı 20 saniye, `max-age` değeri 60 saniye ve `no-cache` yoksa cevap tazedir; sunucuya sormadan kullanılabilir. Aynı cevap 60 saniye yaşındaysa artık taze değildir; yaşın sınırdan küçük olması gerekir, eşit olması yetmez.

Bir de `no-store` ekleyelim. Bu yönerge cevabın önbelleğe saklanmamasını ister. `no-cache` de doğrudan kullanımı engeller ama nedeni farklıdır: varsa önce sunucuya doğrulatılmalıdır. Uygulamada iki yönerge de “şu an kopyayı doğrudan kullanma” demektir; HTTP anlamları farklıdır.

| Durum | Kopya doğrudan kullanılır mı? | Neden? |
| --- | --- | --- |
| Yaş `20`, `max-age=60` | Evet | Süresi dolmamış ve doğrulama istenmemiş |
| Yaş `60`, `max-age=60` | Hayır | Yaş sınırın altında değil |
| Yaş `10`, `no-cache` | Hayır | Sunucuya doğrulatılması gerekir |
| Yaş `1`, `no-store` | Hayır | Cevap saklanmamalı |

Bu ayrım, yönergelerin adlarını ezberlemekten daha işe yarar: biri saklayıp doğrulamayı, diğeri hiç saklamamayı anlatır. HTTP kuralları bu davranışı sunucu cevabındaki yönergelerle bildirir.

## Gerçek bir yanlış ve düzeltmesi

Yanlış: “`no-cache` yazıyorsa tarayıcı hiçbir şeyi saklamaz.” Bu düşünceyle kişisel veriyi korumak istediğinde yalnızca `no-cache` gönderebilirsin; oysa tarayıcı gövdeyi saklayıp her kullanımdan önce doğrulatabilir. Belirti, cevabın tarayıcı belleğinde hâlâ bulunmasıdır. Hiç saklanmamasını istiyorsan `no-store` kullan.

`no-cache` kullanan tür listesinde içerik değişmemişse sunucu `304` döner, tarayıcı eski gövdeyi sunar. Değişmişse sunucu yeni JSON ile `200` döner. Her iki durumda da tarayıcı uygulamaya güncel bir cevap sağlar; ağdan taşınan veri miktarı farklıdır.

:::info[Derinlemesine (isteğe bağlı)]
HTTP caching kurallarının tanımlandığı teknik belgeler RFC olarak yayımlanır; numaralarını ezberlemen gerekmez. Vite derlemesinde `index.html` çoğunlukla sabit addadır; JS ve CSS dosyalarının adında içeriğe göre değişen bir **hash** (özet değer) bulunabilir. Bu yüzden HTML'in güncel dosya adlarını yeniden kontrol etmesi, adı içerik değişince değişen dosyaların uzun süre saklanması yaygın bir yayın tercihidir. CDN ve SPA sunucu yapılandırmasının ayrıntıları bu dersin amacı değildir.
:::

## Özet

- HTTP önbelleği tarayıcının sunucudan gelen cevabı saklayıp yeniden kullanmasını sağlar.
- `max-age` taze kalma süresini saniye cinsinden belirtir.
- `no-cache`, kullanımdan önce doğrulama; `no-store`, hiç saklamama anlamına gelir.
- ETag ve `If-None-Match` ile sunucu değişmemiş cevaba `304` dönebilir; tarayıcı saklı gövdeyi kullanır.

**Yeni terimler:** Cache: yeniden kullanılmak üzere saklanan cevap kopyası. Cache-Control: cache davranışını tarif eden HTTP başlığı. ETag: sunucunun içerik sürümünü tanıtan etiketi. `304 Not Modified`: içeriğin değişmediğini bildirip yeni gövde göndermeyen cevap. Hash: içerikten türetilen kısa özet değer.

**Kendini yokla:** `no-cache` cevabında sunucu `304` döndürürse uygulama veriyi nereden alır?

*Cevap:* Tarayıcının daha önce sakladığı cevap gövdesinden.

**Kendini yokla:** `no-cache` ve `no-store` aynı şeyi mi söyler?

*Cevap:* Hayır. `no-cache` saklamaya izin verir ama önce doğrulama ister; `no-store` saklamayı yasaklar.
