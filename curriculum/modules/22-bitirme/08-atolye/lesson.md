---
title: "Kitaplık atölyesi"
minutes: 5
kind: practice
---

# Kitaplık atölyesi

Bu son atölyede hazır adımları takip etmek yerine Kitaplık kararlarını kendin uygularsın. İki kısa kod çalışmasında arama sayfasının geçmiş/önbellek davranışını ve eser değişince yazar bilgisinin güncellenmesini ele alırsın. İki proje çalışmasında da kendi kitap keşif ekranını kurar ve bir API sınırına dair kararını belgelersin.

:::model[URL ve sorgu önbelleği]
Arama metni, sayfa ve açık eser URL’den gelir; Query key de bu girdilere göre veriyi ayırır. URL değişince ekrandaki veri doğru anahtardan okunmalı. Geri tuşuyla dönmek, aynı URL ve sorgu kimliğine dönmektir.
:::

:::model[State kategorileri]
Arama/eser yanıtları sunucu verisi, adres seçimi URL state’i, okuma listesi kalıcı istemci verisidir. Form taslağı gönderilene kadar geçicidir. Aynı bilgiyi iki yerde saklamamaya ve türetilmiş değerleri kaynaktan hesaplamaya dikkat et.
:::

:::model[ADR]
ADR, mimari kararın gerekçesini ve bedelini saklar. İki yaklaşımı, kullanıcı ihtiyacına ve projenin ölçeğine göre karşılaştır; seçimin neden uygun olduğunu ve hangi bakım maliyetini kabul ettiğini yaz.
:::

## Nasıl ilerleyeceksin?

Her çalışmaya önce görünen belirtiden başla: geri gidince eski sonuç gelmiyor mu, yoksa eser değişince yazar mı takılı kalıyor? Beklenen davranışı bir cümleyle yaz, hangi state kategorisinin bu davranışta söz sahibi olduğunu belirle, sonra küçük değişikliklerle ilerle. Her adımda URL, ekrandaki metin ve istek/önbellek davranışını birlikte kontrol et.

Bağımsız ekranı kurarken önce arama ve seçili eser akışını, sonra yerel okuma listesini ekle. API verisini ve kullanıcının sakladığı veriyi dış girdiler olarak ele al; eksik, bulunamayan veya hatalı veride kullanıcıya anlaşılır durum göster. Son çalışmada API’den gelen yazar özetiyle ayrı yazar isteğini karşılaştır: ek istek ve bakım maliyeti karşılığında kullanıcı ne kazanıyor?

:::mistake[İlk çalışan seçeneği belgelememek]
Belirti: karar notunda yalnızca seçilen yaklaşımın adı var. Neden: alternatifler ve kabul edilen bakım maliyeti yazılmamış. Düzeltme: seçimini en az bir gerçek alternatifle kıyasla ve hangi koşulda yeniden değerlendireceğini belirt.
:::

## Özet

- URL, önbellek ve yerel liste farklı veri sahipleridir.
- Önce kullanıcı belirtisini ve beklenen davranışı tanımla, sonra kodu değiştir.
- Bağımsız ekranda hata, boş sonuç ve eksik veri durumlarını da ele al.
- Karar notu seçeneğin yanında gerekçeyi ve bedeli taşır.

**Yeni terimler:** Atölye: daha az yönlendirmeyle önceki kavramların birlikte uygulandığı çalışma. Bakım maliyeti: seçilen yaklaşımın ileride gerektireceği ek iş.

### Kendini yokla

1. Eser değiştiğinde yazarın da değişmesini hangi iki değeri izleyerek anlarsın? **Cevap:** URL’deki eser kimliğini ve ona bağlı yazar anahtarını.
2. Yazar için ayrı istek atmak ne kazandırabilir, neye mal olur? **Cevap:** Daha zengin yazar bilgisi sağlayabilir; ek ağ isteği ve hata/önbellek yönetimi getirir.
