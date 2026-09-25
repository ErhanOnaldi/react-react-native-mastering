---
title: "İki gerçek taşıma"
minutes: 10
kind: practice
---

# İki gerçek taşıma

:::pain[Problem]
Arama ve detay ekranı ayrı ayrı çalışıyor, fakat ikisi de token, URL ve loading/error kararlarını kendi içinde tekrarlıyor. Bir düzeltme iki yerde unutulabiliyor.
:::

## İhtiyaçtan karar

İki refactor görevinde başlangıç davranışı zaten çalışır. Önce testleri oku, sonra sorumlulukları ayır: ortak HTTP bilgisi ortak yerde, feature anlamı feature’da, görünüm bileşende.

## Sinema’da dene

İlk görev arama sonucu ve sayfa bilgisini; ikinci görev detay başlığı ile eksik poster durumunu ele alır. Her görev bir öncekinden farklı bir veri şekli ve UI sınırı kullanır.

## İki farklı tekrar

Arama görevinde `page === 1` için ayrı fetch dalı, sonraki sayfalar için ayrı dal çalışıyor. `buildSearchUrl(query, page)` çıkarınca Türkçe karakter kodlama ve sayfa parametresi tek yerde olur. Bu, API client dersindeki URL fikrinin farklı bir bağlamıdır: burada bütün endpoint yerine yalnız arama adresini ayırıyorsun.

Detay kartında ise tekrar ağda değil JSX’te. Poster varsa ve yoksa iki ayrı kartın başlığı kopyalanmış. `MoviePoster` poster koşulunu taşırken başlık ile açıklama ortak gövdede kalır. Her iki görevde de mevcut davranış testleri başlangıçta geçer; yeni birimin testi hedefi görünür kılar. Rubric, yeni birimin gerçek akışta kullanılmasını ve gereksiz kopya kalmamasını inceler.

:::mistake[Sık hata]
Çalışan kodu temizlerken yeni özellik eklemeyi ertele. Davranış değişirse küçük adım hangi değişiklikte bozulduğunu gösterir.
:::

:::sector[Sektörde]
Rubric’i bir ekip arkadaşının review notları gibi kullan: tekrar azaldı mı, sınır anlaşılır mı, gereksiz soyutlama var mı?
:::
