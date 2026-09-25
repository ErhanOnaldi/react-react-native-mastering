---
title: "RTK Query, Zustand ve seçim"
minutes: 7
kind: review
---

# RTK Query, Zustand ve seçim

:::pain[Sinema’da sorun]
Sinema’da store kuruldu. Yeni ekip üyesi “TMDB sorgularını da Redux’a taşıyalım” dedi; başka biri “her şeyi Zustand’a çevirelim” diyor.
:::

## Sorunu çöz

TanStack Query mevcut server state sahibidir. RTK Query, Redux ekosistemindeki alternatif server cache aracıdır; geçiş gerekirse bütün veri akışı yeniden tasarlanır. Zustand küçük client state yüzeyi için daha az kurulum sunar. RTK ortak kurallar, middleware ve izlenebilir action akışında güçlüdür.

## Sinema örneği

Sinema’nın dört ortak client slice’ı RTK’de, TMDB cache’i TanStack Query’de, arama `?q=` URL’de, form taslağı RHF’de kalır.

## Sinema için karar

| İhtiyaç | Bugünkü seçim | Değişim gerekirse |
| --- | --- | --- |
| TMDB cache ve refetch | TanStack Query | RTK Query’ye bütün ilgili endpoint’leri planlı taşı |
| Dört ortak client alanı | RTK slice | Küçük uygulamada Zustand değerlendirilebilir |
| URL araması | React Router | Paylaşılabilir link ihtiyacı sürdükçe URL’de kalır |
| Form taslağı | RHF | Submit sonrası verinin sahibi ayrıca belirlenir |

RTK’nin gücü action akışının ve kurallarının görünür olmasıdır. Zustand’ın çekiciliği küçük client state için daha az kurulumdur. İkisi de bir ürün gereksinimine hizmet eder; tek doğru marka seçimi yok. Sinema’da mevcut Query cache’ini sırf RTK store kuruldu diye taşımak gereksiz senkronizasyon işi yaratır.

:::mistake[Sık hata]
Kütüphane sayısını azaltma isteği tek başına migration gerekçesi değildir; cache sahipliği ve ekip maliyetini ölç.
:::

:::sector[Sektörde]
Seçim bir kurum kuralı değil, uygulamanın ihtiyaçlarına göre mimari karardır.
:::
