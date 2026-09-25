---
title: "Sinema’da tek doğrulama kaynağı"
minutes: 8
kind: project
---

# Sinema’da tek doğrulama kaynağı

:::pain[Problem]
Detay sayfası kötü TMDB yanıtında hâlâ çökebiliyor; formlar ve env ayrı kurallar taşıyor. Öğrendiklerini gerçek Sinema sınırlarına yerleştir.
:::

## Neden bu araç?

Önce film şemalarını, sonra API client doğrulamasını, ardından iki form ve env girişini tamamla. Her sınırın testini çalıştır.

## Sinema'da bir adım ileri

Bu modülün çıktısı sonraki Redux ve auth çalışmalarının güvenilir veri tabanı olacak.

## Çalışma sırası

Önce film şemalarını gerçek TMDB fixture'larıyla dene; `poster_path: null` kabul edilirken `title: null` reddedilmeli. Sonra `tmdbClient.get(path, schema, params?)` ile bütün film çağrılarını şemaya bağla. Detay yanıtını MSW ile bozup hatanın UI'dan önce client içinde oluştuğunu gör.

Formlarda mevcut RHF bileşenlerini koru; `register` kurallarını Zod şemasına taşı ve `zodResolver` bağla. Env için uygulama açılışında parse yap. Sonunda 14. modülün liste ve yorum davranışlarını tekrar çalıştır.

| Sınır | Beklenen sonuç |
| --- | --- |
| TMDB 200 + `title: null` | Şema hatası, kontrollü hata ekranı |
| Boş izleme listesi adı | `Ad gerekli`, kayıt yok |
| Boş token | `VITE_TMDB_TOKEN` adlı erken hata |

Üç proje görevi bu adımları ayrı ayrı kontrol eder.

:::mistake[Sık hata]
Yalnızca `movies-api.ts` dönüş tipini değiştirmek bozuk JSON’u engellemez; parse client içinde çalışmalı.
:::

:::sector
Bu sınırlar güvenilir olunca sonraki Redux state’i ve auth akışları bozuk veriyi taşımak zorunda kalmaz.
:::
