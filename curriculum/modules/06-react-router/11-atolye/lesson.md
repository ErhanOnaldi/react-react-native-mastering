---
title: "Geri tuşunda eski arama sonucunu önle"
minutes: 7
kind: practice
---

# Geri tuşunda eski arama sonucunu önle

URL'deki sorgu değişince arama effect'i yeni bir istek başlatır. Ancak ağ cevapları başlama sırasıyla gelmek zorunda değildir; eski istek geç tamamlanıp yeni ekrana yazarsa buna **race condition** (yarış durumu) denir. Sorunu adres, arama alanı ve film listesini ayrı ayrı izleyerek bul.

:::model[URL state]
Güncel URL, arama ekranının hangi sorguya ait olduğunu söyler. Geri tuşu da URL'yi değiştirir; sorguyu bir kez daha local state'e kopyalarsan adres ve input iki ayrı kaynağa dönüşebilir.
:::

:::model[Effect yaşam döngüsü]
Bir effect'in dependency değeri değişince önceki effect'in **cleanup**'ı (temizlik fonksiyonu) çalışır, sonra yeni effect başlar. Cleanup, artık eski sorguya ait olan işin ekrandaki sonucu değiştirmesini durduracağın yerdir.
:::

## Cevaplar farklı sırada gelebilir

Geri tuşu hızlıca kullanıldığında isteklerin ve ekranda kalması gereken sorgunun sırasını izle:

| Sıra | Olay | Hâlâ geçerli sorgu | Beklenen ekran |
| --- | --- | --- | --- |
| 1 | `matrix` adresi açılır | `matrix` | Matrix sonucu |
| 2 | `dovus` adresine gidilir | `dovus` | Dövüş araması yükleniyor |
| 3 | Hemen geri dönülür | `matrix` | Matrix araması yeniden geçerli |
| 4 | Eski `dovus` cevabı geç gelir | `matrix` | Matrix kalır; Dövüş sonucu yazılmaz |

Yalnızca sorgu değişince yeni istek başlatmak yetmez. Eski istek tamamlandığında da hâlâ geçerli olup olmadığını kontrol etmelisin. Bir hata belirtisi şudur: adres `q=matrix` ve input `matrix` derken listede Dövüş Kulübü görünür. Bu, eski cevabın temizlenmeden state'i güncellediğini gösterir; effect cleanup'ında eski işin sonuç yazma hakkını kaldır.

Boş sorgu da ayrı bir durumdur: listeyi temizle ve istek başlatma. Dolu sorguda önceki modülde öğrendiğin `fetch` akışını kullan; proje ortamındaki `VITE_TMDB_TOKEN` değerini `Bearer token` (isteği yetkilendiren erişim anahtarı) olarak gönder.

:::info[Derinlemesine (isteğe bağlı)]
`AbortController`, tarayıcının destekleyen bir isteği durdurmasını sağlayan araçtır. Geç cevabın state'i değiştirmesini engellemek ile ağ aktarımını iptal etmek iki ayrı sonuçtur; bu arama için önce güncelliğini yitirmiş cevabın ekrana yazılmamasını güvenceye al.
:::

## Özet

- Ağ cevapları farklı sırada gelebilir; son başlayan arama her zaman son biten olmayabilir.
- Güncel sorguyu URL'den oku; URL ile input için iki ayrı state kaynağı oluşturma.
- Dependency değişimindeki cleanup, eski arama sonucunun ekrana yazılmasını engellemek için çalışır.
- Boş sorguda listeyi temizle ve yeni istek başlatma.

**Terimler**

- **Race condition (yarış durumu):** İşlerin bitiş sırası değiştiği için eski sonucun yeni durumu bozması.
- **Cleanup:** Effect dependency'si değiştiğinde veya component kaldırıldığında çalışan temizlik fonksiyonu.
- **AbortController:** Destekleyen tarayıcı işlemini, örneğin bir `fetch` isteğini, iptal etme aracı.

**Kendini yokla:** Adres `matrix` iken gecikmiş `dovus` cevabı neden ekrana yazılmamalı?

**Cevap:** Güncel URL `matrix` aramasını seçmiştir; `dovus` cevabı artık geçerli ekranın sonucu değildir.
