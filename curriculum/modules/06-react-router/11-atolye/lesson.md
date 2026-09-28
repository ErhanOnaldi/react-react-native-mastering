---
title: "Geri tuşunda eski sonucu düzelt"
minutes: 6
kind: practice
---

# Geri tuşunda eski sonucu düzelt

:::pain[Problem]
`/search?q=matrix` açınca Matrix görünür. “Dövüş ara” bağlantısına basıp hemen geri dönüyorsun; adres `q=matrix` olsa da gecikmiş Dövüş sonucu bir an sonra listeye yazılıyor.
:::

Bu atölyede hazır bir arama ekranındaki belirtiyi tekrarlayıp nedeni bulacaksın. URL değiştiğinde hangi değer yeni ekranın sahibi? Eski bir asenkron işlem tamamlanınca hâlâ görünür sonucu değiştirebilir mi? Önce gözlem yap, sonra sorunun oluştuğu yeri kendi çözümünle düzelt.

:::model[URL state ve render kimliği]
Adres route'un ve arama görünümünün güncel seçimini taşır; sonuçları gösteren bileşen bu seçimle senkron olmalıdır. Geri tuşu da yeni bir navigasyondur ve React route'u yeniden render eder. Yeni bağlamdaki ek risk, önceki URL'den başlatılmış ağ işinin daha sonra tamamlanıp artık geçerli olmayan ekranın state'ini güncellemesidir.
:::

## Belirtiyi daralt

1. Arama sayfasını verilen başlangıç adresinde aç ve ilk sonucu bekle.
2. Başka bir sorgu bağlantısını seç, sonra yeni sonuç gelmeden geri navigasyon yap.
3. Adres çubuğunu, input değerini ve film başlığını ayrı ayrı gözle.
4. Hangi sorgunun başlamış olduğunu ve hangi sorgunun ekranda kalması gerektiğini zaman sırasıyla not et.
5. Eski işlemin sonucu artık geçerli değilken ekrana yazmasını engelle.

`SearchPage`'in davranışını URL'nin tek kaynak olmasıyla birlikte düşün. Sorguyu ayrıca local state'e kopyalamak geri navigasyonda başka bir ayrışma yaratabilir. Bir effect içinde başlayan asenkron işin ömrü, bileşenin render'ları ve cleanup sırasıyla bağlıdır; önceki modülde öğrendiğin cleanup ve race condition bilgisi burada tekrar devreye girer.

Çözümünü birkaç farklı hız ve sıra ile gözle: hızlı yeni sorgu, geri navigasyon ve ilk yükleme. Kullanıcı arayüzünde güncel URL'nin anlattığı sonuç kalmalı. Ağ davranışını anlamak için tarayıcı Network panelinde sorguların başlangıç ve tamamlanma sırasına bakabilirsin.

:::sector
Arama ve filtre ekranları hızla değişen kullanıcı girdisi ile gecikmeli ağ cevabını birleştirir. Ekipler URL'nin güncel sorguyu tanımlamasını ve artık geçerli olmayan isteğin ekrana yazmamasını birlikte güvenceye alır; aksi durumda sonuçlar kullanıcıya rastgele görünür.
:::

## Özet

- Geri tuşu URL state'ini değiştirir ve yeni bir render/navigasyon başlatır.
- Önceki sorgudan gelen geç cevap güncel sonucu ezmemelidir.
- Belirtiyi URL, input ve sonuç listesini karşılaştırarak daralt.
- Effect cleanup'ı eski asenkron işin yazma hakkını kapatmak için kullan.

**Kendini yokla:** URL `matrix` derken `Dövüş` sonucu görünüyorsa hangi iki şey senkron değil?

*Cevap:* Güncel URL seçimi ile ekrandaki asenkron sonuç.
