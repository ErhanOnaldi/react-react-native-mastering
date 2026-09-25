---
title: "Sinema: izleme listesi ve yorum"
minutes: 6
kind: project
---

# Sinema: izleme listesi ve yorum

:::pain[Problem]
Sinema'da izleme listesi hâlâ tek ekranlık state'te duruyor; sayfayı yenileyince kayboluyor. Yorum formundaki özel yıldız girişi de `register` ile bağlanamıyor. Şimdi iki akışı gerçek projeye taşı.
:::

## İki ayrı veri yolu

İzleme listesi tarayıcıdaki `localStorage`'a yazılır: ad, açıklama, görünürlük ve dinamik etiketler. `WatchlistForm`, RHF'nin `register`, `handleSubmit`, `useFieldArray` araçlarını kullanır. `useWatchlists` ekleme ve okuma işini kapsüller. Domain tipinden `Omit<Watchlist, 'id' | 'createdAt'>` ile form değerini türet.

Yorum, DummyJSON'a `POST /comments/add` ile gönderilir. `ReviewForm` metin alanını `register`, özel puan girişini `Controller` ile bağlar. `useMutation` gönderim durumunu gösterir. Yorum endpoint'i yalnızca `body`, `postId`, `userId` kabul eder; puanı aynı isteğin gövdesine zorla katma.

## Bir sonraki ihtiyaç

Yerleşik RHF kuralları burada yeterli. Ancak kurallar ile TypeScript tipleri iki ayrı yerde kaldı. Modül 15'te Zod şeması bu senkron sorununa çözüm olacak.

:::sector
Dosya yolları ve export adları görev metinlerinde açık. Testler kullanılabilir davranışı ölçer; görünüm sınıflarını serbestçe seçebilirsin.
:::
