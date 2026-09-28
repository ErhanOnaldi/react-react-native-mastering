---
title: "Sinema modalı ve detay sekmeleri"
minutes: 9
kind: project
---

# Sinema modalı ve detay sekmeleri

:::pain[Problem]
Sinema'nın film detayı uzun bir sayfa: özet, oyuncu listesi, izleme listesi düğmeleri ve yorum formu alt alta. Fragmanı izlemek için sayfadan çıkıp YouTube'da aramak gerekiyor. Detay sayfasını yalnızca klavyeyle dolaşmayı dene: hangi bölümde olduğunu, hangi düğmenin ne yaptığını anlamak zor.
:::

## Bu derste ne yapacaksın?
Kod alıştırmalarında parça parça kurduğun her şeyi, yeniden kullanılabilir iki bileşen olarak Sinema'ya taşıyorsun:

1. **`Modal`** (`src/shared/ui/modal/`): `useDisclosure` + Context + portal + focus trap + Escape + focus'u geri verme + `asChild`. Detay sayfasında **Fragmanı aç** düğmesi bu modalı açacak.
2. **`Tabs`** (`src/shared/ui/tabs/`): Context + yön tuşları + `aria-controls`/`aria-labelledby`. Detay sayfasındaki Özet / Oyuncular / Videolar bölümleri bu sekmelere geçecek.

Alıştırmalardan farkı: içerik artık sabit iki düğme değil, rastgele `children`. Focus trap ilk ve son kontrolü **her Tab'da yeniden bulmalı** ve `disabled` olanları atlamalı. Veri de gerçek: videosu olmayan filmlerde fragman düğmesi ve Videolar sekmesi hiç görünmemeli.

## Doğrulama
Testler hem bileşenleri tek başına hem de gerçek detay sayfasını (550 Dövüş Kulübü, videosu olmayan bir film) sahte TMDB ile render ederek davranışı kontrol eder. Testler geçtikten sonra tarayıcıda fareye dokunmadan dene: Tab ile Fragmanı aç'a gel, Enter, Tab ile dolaş, Escape. Sonra sekmelere gel ve ok tuşlarıyla gez. Focus halkası her an görünür olmalı.

:::tip[Bir a11y düzeltmesi daha]
1. derste favori düğmesindeki çelişkiyi gördün: Sinema'nın detay sayfası ve film kartı hem adı değiştiriyor ("Favoriye ekle" ↔ "Favorilerden çıkar") hem `aria-pressed` kullanıyor. Detay sayfasına dokunurken bunu da düzelt. Adlar aynı kalsın; yalnızca çelişen `aria-pressed` gitsin (görünür metin zaten ad olduğu için `aria-label` da gereksiz).
:::

:::sector
Sonraki (opsiyonel) modülde aynı davranışları hazır, test edilmiş Radix primitive'leriyle kuracaksın. Burada mekaniği bizzat yazmış olman, bir kütüphanenin varsayılanlarını okuyup doğru yapılandırmanı kolaylaştıracak.
:::
