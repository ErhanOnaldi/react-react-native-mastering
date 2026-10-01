---
title: "Pekiştirme: film tarayıcısı"
minutes: 7
kind: practice
---

# Pekiştirme: film tarayıcısı

Bu iki alıştırmada arama, seçim ve sıralama bir arada çalışır. İlkinde bir filmi favorile, aramayla gizle ve aramayı temizle; ikincisinde film seçip liste sırasını değiştir. Her adımda sor: hangi değer değişti, hangi film aynı kaldı?

:::model[State snapshot]
Event handler kendi render'ında gördüğü state değerini kullanır. Önceki state'e dayanarak güncelleme yaparken updater fonksiyonu al; React güncellemeleri sıraya koyar. Arama sonucunda bir film gizlense bile favorite id'si ayrı state'te kalır.
:::

:::model[Ağaçta kimlik ve key]
`key` React'e listede hangi satırın aynı film olduğunu bildirir. Film id'si de seçimin hangi kayda ait olduğunu anlatır; sıralama yalnız görünüşteki yeri değiştirir. Bu yüzden seçim id ile kalır, satır numarasıyla değil.
:::

## İki akışı elle dene

Önce aramayı kullanarak bir filmi göster, favoriye al, başka sorgu yaz ve sorguyu temizle. Favori işaretinin geri gelmesi gerekir; görünür liste arama metninden hesaplanırken favori film kimliğine bağlıdır.

Sonra bir filmi seçip “Sırayı ters çevir” davranışını dene. Seçili film aynı kalmalı. Yeni sıralanmış dizi üretmek için kaynak dizinin kopyası üzerinde çalış; doğrudan `reverse()` çağrısı kaynak diziyi de değiştirir.

## Özet

- Görünür filmleri kaynak veri ve sorgudan hesapla.
- Favori ve seçimi film id'siyle sakla; index yalnız geçici sıra konumudur.
- Sıralanmış görünüm için kaynak diziyi değiştirme ve `key` olarak sabit id kullan.

**Kendini yokla:** Aramada gizlenen film favori bilgisini neden kaybetmemeli?
*Cevap:* Favori, görünür satırın değil filmin id'sine bağlı durumdur.
