---
title: "Sinema: akıcı büyük liste"
minutes: 7
kind: project
---

# Sinema: akıcı büyük liste

:::pain[Problem]
Sinema'da yüzlerce sonuç inputu geciktiriyor; favori düğmesi de ağ yanıtı gelene kadar tepkisiz görünüyor. Birinci değişiklikte liste işini, ikincide bekleyen etkileşimi ele al.
:::

## Proje sınırlarını koru

Bu proje görevlerinde arama ve sanal listeleme ile bekleyen favori davranışı, lazy detay route'u ve React Compiler yapılandırması ele alınıyor. Önce ilgili Sinema akışını oku; URL ve veri cache davranışını koruyarak küçük değişiklikler yap. Her değişiklikten sonra aynı kullanıcı senaryosunu yeniden dene.

:::model[Render tetikleyicileri ve memo sınırları]
Memo sınırı yalnız girdileri sabit kaldığında hesaplamayı veya alt ağacı atlar. Inputun anlık state'i ile listenin daha düşük öncelikli sorgusunu ayır; sanal pencereyi doğru filtrelenmiş sonuçtan üret.

:::

![Render nedenlerini ve memo sınırlarını gösteren akış](diagram:render-nedenleri)

:::model[Ağaç ve kimlik]
Bileşenin state'i ağaçtaki konumuna ve key değerine bağlıdır. Liste satırında film id'si kullan; konum anahtarı filtre/sıralama sırasında favori state'ini yanlış filme bağlayabilir.

:::

![Ağaç konumu ve key state kimliğini belirler](diagram:agac-ve-kimlik)

## Uygulama sırası

1. Aynı arama teriminde input gecikmesini ve DOM satır sayısını kaydet.
2. Filtrelenmiş 500 sonuçta görünür satır sayısını düşür; boş ve tek sonuç halini kontrol et.
3. Favori tıklamasında bekleme görünümünü ve başarısızlık sonrası geri dönüşü ayrı izle.
4. Detay route'unun ilk ekrandan bağımsız yüklenmesini ve üretim build ayarını incele.

React Compiler'ın Babel yolu için Sinema projesinde paketleri şu komutla kur:

```sh
pnpm add -D babel-plugin-react-compiler @rolldown/plugin-babel
```

Ardından Vite yapılandırmasına React Compiler eklentisini bağla. Deneysel compiler bayrağı yerine kararlı eklenti yolunu kullan.

:::mistake
**Belirti:** arama doğru ama kaydırma alanında yüzlerce satır var. **Neden:** filtreleme yapılmış, liste sanallaştırılmamıştır. **Düzeltme:** sanal pencerenin sayısını filtrelenmiş diziden üret.
:::

:::mistake
**Belirti:** başarısız kayıt sonrası favori açık kalır. **Neden:** geçici görünüm onaylanmış state'e yazılmıştır. **Düzeltme:** temel state'i yalnız başarıda güncelle.
:::

:::sector
Performans değişikliğini Profiler gözlemi, DOM boyutu ve gerçek etkileşimle birlikte değerlendir. Build ayrımı ilk yüklenen JavaScript'i etkiler; tek başına arama etkileşimini hızlandırmaz.
:::

## Özet

- URL ve veri akışını koruyarak değiştir.
- Input güncelliği ile büyük liste işini ayır.
- Sanal satırları film kimliğiyle eşle.
- Bekleyen UI ile onaylanmış state'i ayır.
- Compiler yapılandırmasını gerekli paketlerle etkinleştir.
