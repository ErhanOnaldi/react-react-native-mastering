---
title: "State ve asenkron belirtileri"
minutes: 6
kind: practice
---

# State ve asenkron belirtileri

Atölyede dört küçük Sinema davranışını onaracaksın: film seçimine göre özet, seçili tür sayısı, arama cevabının sırası ve film id'si değişen detay. Başlangıç kodunda sorun görülebilir; önce neyin yanlış olduğunu tarif et, sonra hangi değerin asıl kaynak olduğunu ve hangi işin artık güncel olmadığını bul.

:::model[State snapshot]
Event handler ve Promise callback'i oluşturulduğu render'ın props/state değerlerini görür. Eski callback daha sonra çalıştığında, içinde tuttuğu değer yeni ekrandaki değerden farklı olabilir.
:::

:::model[Effect yaşam döngüsü]
Effect, dependency değiştiğinde eski çalışmasını cleanup eder ve yeni değerlerle yeniden başlar. Detay isteği film `id` değerine bağlıysa yeni id geldiğinde yeni istek gerekir; eski çalışmanın geç cevabı da yeni filmi ezmemelidir.
:::

:::model[Ağaç ve kimlik]
React state'i bileşenin ağaçtaki yerine ve varsa `key` değerine göre korur. Aynı yerde aynı bileşen yeni props alırsa iç state'i korunabilir; bu nedenle film id'si değişti diye eski state'in kendiliğinden sıfırlanacağını varsayma.
:::

## Belirti hangi soruyu sorduruyor?

| Belirti | İlk soru |
| --- | --- |
| Film değişiyor, özet değişmiyor | Özet ayrı state mi, seçili filmden hesaplanabilir mi? |
| Tür seçimi değişiyor, sayı kalıyor | Sayı seçili id'lerden hesaplanabilir mi? |
| Eski arama yeni sonucu eziyor | Eski isteğin sonucu hâlâ ekrana yazabilir mi? |
| Detay başlığı değişmiyor | İstek hangi film kimliğine bağlı? |

İlk iki belirti aynı düşünceyi paylaşır: film özeti ve tür sayısı başka bir değerden hesaplanabiliyorsa, ikisini ikinci bir state'e kopyalamak gerekmez. Son iki belirti zamanlamayla ilgilidir: arama cevapları istek sırasından farklı sırada gelebilir; ayrıca aynı bileşen yeni `id` aldığında effect'in bu id'yi izlemesi gerekir.

## Eski ve yeni aramayı zaman çizelgesinde gör

Arama alanına `Alien`, ardından hemen `Arrival` yazdığını düşün. Her Promise, ağ cevabını bekleyen iştir; istek başlatıldıktan sonra başka işler de devam edebilir.

| An | Olan | Ekran için geçerli sorgu |
| --- | --- | --- |
| 1 | `Alien` isteği başlar | `Alien` |
| 2 | `Arrival` yazılır ve yeni istek başlar | `Arrival` |
| 3 | `Arrival` cevabı önce gelir | `Arrival` sonucu görünür |
| 4 | `Alien` cevabı geç gelir | Ekran hâlâ `Arrival` sonucunu göstermeli |

Son satırdaki tehlike, eski cevabın sadece geç gelmesi değildir; artık geçerli olmayan bir sorgunun ekrana yazma hakkını korumasıdır. Effect cleanup'ı eski işi geçersiz kılar ya da isteği durdurur. Yeni sonuç ancak yeni sorguya ait cevapla güncellenir.

:::mistake[İlk açılışı düzeltip değişimi unutmak]
Belirti → Detay ilk filmde doğru görünür, ama aynı ekranda başka filme geçince başlık eski kalır. Neden → Effect yalnız mount anında çalışıyordur ya da eski detay state'i yeni id için de gösteriliyordur. Düzeltme → `id` değişince effect'i yeniden çalıştır; yeni cevap gelene kadar eski detayı gösterme.
:::

## Nasıl ilerlemeli?

Önizlemede belirtiyi üret ve beklediğin davranışı bir cümleyle yaz. Sonra bilgiyi iki gruba ayır: kullanıcı seçimi gibi gerçek state ve o state'ten hesaplanabilecek özet; yeni id/sorgu gibi effect'in izlemesi gereken değerler ve artık geçersiz olan eski işler. En küçük düzeltmeyi yap, sonra seçim değişimi, temizleme veya hızlı geçişi tekrar dene.

Bir çözüm ilk görüntüyü düzeltip sonraki değişimde bozuluyorsa tek bir “mutlu yol” çalışıyordur. Her değişimde bilgi kaynağının güncel kaldığını da kontrol et.

## Özet

- Özet değerleri başka state'ten hesaplanabiliyorsa onları ayrıca saklama.
- State'in hangi bileşene ait olduğunu ağaçtaki konum ve `key` belirler.
- Effect'in bağımlılığı değiştiğinde yeni id veya sorgu için yeniden çalışması gerekir.
- Eski async işlerin yeni sonucu ezmesine izin verme.

**Yeni terimler**

- `Promise`: Daha sonra tamamlanacak bir işlemin sonucunu temsil eden JavaScript nesnesi.
- `Dependency`: Effect'in kullandığı ve değişince Effect'i yeniden çalıştıran değer.

**Kendini yokla:** Seçili tür sayısı her zaman seçili tür dizisinin uzunluğuna eşitse bunu ayrıca state'te tutmalı mısın?

**Cevap:** Hayır. Render sırasında dizinin uzunluğundan hesaplayabilirsin; böylece iki değeri birlikte güncel tutman gerekmez.
