---
title: "Eser detayı ve okuma listesi"
minutes: 10
kind: project
---

# Eser detayı ve okuma listesi

Bir eser sayfası iki ayrı bilgiyi birleştirebilir: Open Library’den gelen eser ve eserin içindeki yazar anahtarıyla bulunan yazar. Okuma listesi ise senin tarayıcında kalır. Bunları tek bir state’e yığmak yerine her birinin kaynağını koru.

:::model[Sunucu verisi ve istemci verisi]
Eser/yazar yanıtları sunucu state’idir; URL’deki eser kimliği sorgunun hangi kaydı istediğini belirler. Okuma listesi istemci state’idir ve tarayıcıda saklanır. Form alanları kaydedilene kadar geçici taslaktır. Menü sayısı gibi değerler listeden hesaplanır.
:::

## Eserden yazara

İlk istek eser bilgisini getirir. Yazar anahtarı bu yanıtta bulunuyorsa ikinci istek yapılabilir; anahtar yoksa yazar isteği başlatılmaz. Bu, **dependent query**’dir: bir sorgunun çalışması başka sorgunun sonucuna bağlıdır. Yazar bulunamazsa “Yazar bilinmiyor” göster, ama eser başlığını ve açıklamasını koru.

API açıklaması bazen doğrudan metin, bazen `{ type, value }` nesnesi olabilir. Bileşene tek bir metin biçimi ulaştırmak için sınırda normalleştir. Kapak kimliği de yoksa veya negatifse geçerli bir resim URL’i üretme.

## Formu güvenli kayda çevir

Kullanıcı durum olarak “Okudum” seçince puan zorunlu olsun; diğer durumlarda puan gerekmeyebilir. Birden fazla alanı birlikte inceleyen Zod doğrulaması için **`superRefine`** kullanılabilir. Bu yöntem, alanlar arasındaki koşula göre belirli alana hata eklemene yarar.

Kaydetme anında form verisini doğrula, sonra okuma listesine yaz. `localStorage`’dan gelen içerik için `JSON.parse` tek başına yeterli değildir: JSON sözdizimsel olarak geçerli olsa bile beklenen kayıt olmayabilir. Zod’un **`safeParse`** metodu hata fırlatmak yerine başarı/hata sonucunu döndürür; başarılıysa doğrulanmış `data`, değilse güvenli boş liste kullanılır. Parse hatasını da `try/catch` ile yakala.

| Adım | Form | Doğrulama | Liste |
| --- | --- | --- | --- |
| Durum seçilir | Taslak değişir | Henüz gönderilmedi | Değişmez |
| “Okudum” seçilir | Puan alanı gerekir | Puan kontrol edilir | Değişmez |
| Puan eksikken kaydedilir | Hata gösterilir | Başarısız | Değişmez |
| Geçerli kayıt gönderilir | Kaydetme tamamlanır | Başarılı | Tek kayıt eklenir/güncellenir |

Bu sıra, geçersiz formun depoyu değiştirmemesini sağlar. Liste sayısı için ayrı state açma; listenin güncel uzunluğunu kullan.

![Form girdisi doğrulanıp geçerli okuma kaydı olarak yerel depoya yazılır](diagram:form-state)

:::mistake[Bozuk yerel kaydın uygulamayı düşürmesi]
Belirti: Tarayıcı verisi temizlenmiş ya da elle bozulmuşsa uygulama açılmaz. Neden: `JSON.parse` hatası yakalanmamış veya parse edilen biçim doğrulanmamıştır. Düzeltme: Parse hatasını ele al, sonra `safeParse` sonucuna göre doğrulanmış veriyi ya da boş listeyi kullan.
:::

## Çalışma sırası

Önce eser ve yazar isteklerinin bağımlılığını belirle; yazar hatasının ana eseri saklamadığını doğrula. Sonra okuma kaydının alanlarını ve form kurallarını netleştir. Depolama okuma/yazma sınırını ayrı tut; liste sayfası, detay formu ve üst menü aynı kayıt kaynağını kullansın. `localStorage` cihaz ve tarayıcıya özeldir; hesaplar arasında eşitlenmez.

## Özet

- Eser/yazar sunucu verisi, okuma listesi yerel istemci verisidir.
- Yazar sorgusu eser yanıtına bağlıdır; yazar hatası tüm detay ekranını bozmamalı.
- `superRefine` alanlar arası koşullu doğrulama ekler.
- `safeParse` doğrulama sonucunu döndürür; bozuk depodan güvenli varsayılana dön.

**Yeni terimler:** Dependent query: girdisi başka bir sorgu sonucuna bağlı sorgu. `superRefine`: Zod şemasında birden çok alanı inceleyip özel hata ekleme yöntemi. `safeParse`: hata fırlatmadan başarılı veri veya doğrulama hatası döndüren Zod metodu.

### Kendini yokla

1. Yazar isteği başarısız olduğunda eser neden ekranda kalmalı? **Cevap:** Yazar ve eser ayrı kaynaklardır; ikincil bilginin hatası ana veriyi geçersiz kılmaz.
2. `safeParse` yerel depoda ne sağlar? **Cevap:** Geçersiz biçimi kontrol akışıyla ele almayı, uygulamayı doğrulama hatasıyla düşürmemeyi sağlar.
