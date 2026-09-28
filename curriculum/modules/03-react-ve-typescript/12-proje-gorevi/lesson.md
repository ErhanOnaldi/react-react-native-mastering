---
title: "Sinema proje görevi"
minutes: 7
kind: project
---

# Sinema proje görevi

:::pain[Arama ve favori iki ayrı deneme gibi davranıyor]
Film kartları ekranda duruyor ama favori işareti aramada kayboluyor. API'ye geçmeden önce, gerçek örnek veride arama ve favori etkileşiminin aynı uygulama içinde birlikte çalıştığını kurman gerekiyor.
:::

## Bu aşamada neler birleşiyor?

İlk görevde fixture'lardan tipli statik film listesi ve üç gösterim bileşeni hazırlanır. Her bileşenin dosya/export ve props sözleşmesi görev metninde bulunur. Afiş yolu eksik olabileceği için veri tipini ve görünür fallback'i birlikte düşün; eksik resim adresini gerçekmiş gibi kullanma.

İkinci görev `App` içinde sorgu ve favori kimliklerinin sahibi olmayı gerektirir. Arama kutusu controlled kalır; grid aynı owner'dan aldığı görünür filmleri gösterir. Favori bilgisini film id'leriyle tutarsan filtrelenip geri gelen kart aynı durumu alır. Filtrelenmiş listeyi state'e kopyalamadan render sırasında kaynaktan türet.

:::model[Props aşağı, olay yukarı]
Ortak ebeveyn paylaşılacak state'i tutar ve değeri çocuklara props olarak verir. Çocuk event'ten çıkan yeni bilgiyi callback ile yukarı yollar; sonraki render aynı kaynağı yeniden dağıtır. Bu projede arama kutusu sorguyu bildirir, kart da hangi filmde favori değişikliği istediğini bildirir.
:::

:::model[State'in sahibi ve component kimliği]
React state'i ağaçtaki component konumu/türü/key ile, ürün verisi ise kendi id'siyle anlam kazanır. Film listesinin sırası değişebilir ama favori kimliği değişmez. Sabit film id'sini listede key olarak kullan.
:::

## İşi gözle kontrol et

Önce `Dövüş` araması yap; sonra bir filmi favoriye ekle, başka filmi ara ve sorguyu temizle. Favori işareti geri gelmeli ve başka filme geçmemeli. Sonuç yokken açıklayıcı boş durum görünmeli. Bu adımlar state sahibini ve türetilmiş görünümü kontrol eder; ağ katmanını bu işin içine katmaz.

## Özet

- Örnek veriyi fixture'dan al ve mevcut `Movie` sözleşmesini koru.
- Sorgu ile favori kimliklerini uygulamanın ortak üst bileşeninde tut.
- Görünür listeyi türet, favori güncellemesinde yeni dizi üret ve stable key kullan.

**Kendini yokla:** Bir kartın favori düğmesi hangi değeri parent'a bildirmeli?  
*Cevap:* Değişiklik istenen filmin id'sini; parent favori state'inin sahibidir.

:::sector
Gerçek projede veri kaynağını önce sabit tutmak, bileşen API'sini ağ durumlarından bağımsız biçimde kurmanı sağlar. Aynı arayüz sözleşmesi daha sonra API verisi geldiğinde de kullanılabilir.
:::
